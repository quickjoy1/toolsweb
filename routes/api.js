const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { PythonShell } = require("python-shell");
const config = require("../config/config");

/* ----------------------------------------------
    MULTER STORAGE
---------------------------------------------- */
const storage = multer.diskStorage({
    destination: (_, __, cb) => cb(null, config.UPLOAD_DIR),
    filename: (_, file, cb) => {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, `${unique}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: config.MAX_FILE_SIZE }
});

/* ----------------------------------------------
    UNIVERSAL PYTHON EXECUTOR
---------------------------------------------- */
function runPython(script, args = []) {
    return new Promise((resolve, reject) => {
        const pyshell = new PythonShell(script, {
            mode: "text",
            pythonPath: config.PYTHON_PATH,
            pythonOptions: ["-u"],
            scriptPath: path.join(__dirname, "../python"),
            args
        });

        let messages = [];

        pyshell.on("message", msg => messages.push(msg));
        pyshell.on("stderr", err => console.error("PYTHON STDERR:", err));
        pyshell.on("error", reject);

        pyshell.end(err => {
            if (err) return reject(err);
            try {
                const last = messages[messages.length - 1];
                resolve(JSON.parse(last));
            } catch {
                reject(new Error("Invalid JSON from Python script"));
            }
        });
    });
}

/* ----------------------------------------------
    UTILITIES
---------------------------------------------- */
const deleteFiles = files => files.forEach(f => fs.unlink(f, () => {}));

const autoDelete = (file, ms = 600000) =>
    setTimeout(() => fs.unlink(file, () => {}), ms);

/* ----------------------------------------------
    PDF → WORD
---------------------------------------------- */
router.post("/convert/pdf-to-word", upload.single("pdfFile"), async (req, res) => {
    try {
        if (!req.file)
            return res.status(400).json({ success: false, error: "No file uploaded" });

        if (!req.file.originalname.toLowerCase().endsWith(".pdf")) {
            fs.unlink(req.file.path, () => {});
            return res.status(400).json({ success: false, error: "Only PDF allowed" });
        }

        const input = req.file.path;
        const outputName = req.file.filename.replace(/\.pdf$/i, ".docx");
        const outputPath = path.join(config.RESULTS_DIR, outputName);

        const result = await runPython("pdf_to_word.py", [input, outputPath]);
        fs.unlink(input, () => {});

        if (!result.success) {
            fs.unlink(outputPath, () => {});
            return res.status(400).json(result);
        }

        autoDelete(outputPath);

        return res.json({
            success: true,
            message: result.message,
            downloadUrl: `/results/${outputName}`,
            filename: outputName
        });

    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ success: false, error: "Server error during conversion" });
    }
});

/* ----------------------------------------------
    JPG/PNG → PDF
---------------------------------------------- */
router.post("/convert/jpg-to-pdf", upload.array("imageFiles", 10), async (req, res) => {
    try {
        if (!req.files?.length)
            return res.status(400).json({ success: false, error: "No files uploaded" });

        const valid = [".jpg", ".jpeg", ".png"];
        const wrong = req.files.filter(f => !valid.includes(path.extname(f.originalname).toLowerCase()));

        if (wrong.length) {
            deleteFiles(req.files.map(f => f.path));
            return res.status(400).json({ success: false, error: "Only JPG & PNG allowed" });
        }

        const images = req.files.map(f => f.path);
        const outputName = `converted-${Date.now()}.pdf`;
        const outputPath = path.join(config.RESULTS_DIR, outputName);

        const result = await runPython("jpg_to_pdf.py", [JSON.stringify(images), outputPath]);
        deleteFiles(images);

        if (!result.success) {
            fs.unlink(outputPath, () => {});
            return res.status(400).json(result);
        }

        autoDelete(outputPath);

        return res.json({
            success: true,
            message: result.message,
            downloadUrl: `/results/${outputName}`,
            filename: outputName
        });

    } catch (err) {
        console.error("Error:", err);
        return res.status(500).json({ success: false, error: "Server error during conversion" });
    }
});

/* ----------------------------------------------
    CONTACT FORM
---------------------------------------------- */
router.post("/contact", (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message)
        return res.status(400).json({ success: false, error: "All fields are required" });

    console.log("Contact message:", { name, email, message });

    return res.json({
        success: true,
        message: "Thank you for contacting us! We will get back to you soon."
    });
});

module.exports = router;
