const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { PythonShell } = require('python-shell');
const config = require('../config/config');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, config.UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: config.MAX_FILE_SIZE }
});

router.post('/convert/pdf-to-word', upload.single('pdfFile'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, error: 'No file uploaded' });
  }

  if (!req.file.originalname.toLowerCase().endsWith('.pdf')) {
    fs.unlink(req.file.path, () => {});
    return res.status(400).json({ success: false, error: 'Only PDF files are supported' });
  }

  const pdfPath = req.file.path;
  const outputFilename = req.file.filename.replace(/\.pdf$/i, '.docx');
  const outputPath = path.join(config.RESULTS_DIR, outputFilename);

  const options = {
    mode: 'text',
    pythonPath: config.PYTHON_PATH,
    pythonOptions: ['-u'],
    scriptPath: path.join(__dirname, '../python'),
    args: [pdfPath, outputPath]
  };

  PythonShell.run('pdf_to_word.py', options, (err, results) => {
    fs.unlink(pdfPath, () => {});

    console.log('PDF to Word conversion - Error:', err);
    console.log('PDF to Word conversion - Results:', results);

    if (err) {
      console.error('Conversion error:', err);
      return res.status(500).json({ 
        success: false, 
        error: 'Conversion failed. Please ensure the PDF is valid and not corrupted.' 
      });
    }

    if (!results || results.length === 0) {
      console.error('No results from Python script');
      return res.status(500).json({ 
        success: false, 
        error: 'No response from conversion process' 
      });
    }

    try {
      const lastResult = results[results.length - 1];
      console.log('Parsing result:', lastResult);
      const result = JSON.parse(lastResult);
      if (result.success) {
        req.session.lastConversion = {
          file: outputFilename,
          timestamp: Date.now()
        };
        
        setTimeout(() => {
          fs.unlink(outputPath, () => {});
        }, 600000);

        console.log('Sending success response');
        res.json({
          success: true,
          message: result.message,
          downloadUrl: `/results/${outputFilename}`,
          filename: outputFilename
        });
      } else {
        fs.unlink(outputPath, () => {});
        console.error('Conversion failed:', result.error);
        res.status(400).json({ success: false, error: result.error || 'Conversion failed' });
      }
    } catch (e) {
      console.error('Parse error:', e);
      fs.unlink(outputPath, () => {});
      res.status(500).json({ success: false, error: 'Failed to parse conversion result: ' + e.message });
    }
  });
});

router.post('/convert/jpg-to-pdf', upload.array('imageFiles', 10), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ success: false, error: 'No files uploaded' });
  }

  const validExtensions = ['.jpg', '.jpeg', '.png'];
  const invalidFiles = req.files.filter(file => {
    const ext = path.extname(file.originalname).toLowerCase();
    return !validExtensions.includes(ext);
  });

  if (invalidFiles.length > 0) {
    req.files.forEach(file => fs.unlink(file.path, () => {}));
    return res.status(400).json({ success: false, error: 'Only JPG and PNG files are supported' });
  }

  const imagePaths = req.files.map(file => file.path);
  const outputFilename = 'converted-' + Date.now() + '.pdf';
  const outputPath = path.join(config.RESULTS_DIR, outputFilename);

  const options = {
    mode: 'text',
    pythonPath: config.PYTHON_PATH,
    pythonOptions: ['-u'],
    scriptPath: path.join(__dirname, '../python'),
    args: [JSON.stringify(imagePaths), outputPath]
  };

  PythonShell.run('jpg_to_pdf.py', options, (err, results) => {
    imagePaths.forEach(imgPath => {
      fs.unlink(imgPath, () => {});
    });

    if (err) {
      return res.status(500).json({ 
        success: false, 
        error: 'Conversion failed. Please ensure all images are valid.' 
      });
    }

    if (!results || results.length === 0) {
      return res.status(500).json({ 
        success: false, 
        error: 'No response from conversion process' 
      });
    }

    try {
      const lastResult = results[results.length - 1];
      const result = JSON.parse(lastResult);
      if (result.success) {
        req.session.lastConversion = {
          file: outputFilename,
          timestamp: Date.now()
        };
        
        setTimeout(() => {
          fs.unlink(outputPath, () => {});
        }, 600000);

        res.json({
          success: true,
          message: result.message,
          downloadUrl: `/results/${outputFilename}`,
          filename: outputFilename
        });
      } else {
        fs.unlink(outputPath, () => {});
        res.status(400).json({ success: false, error: result.error || 'Conversion failed' });
      }
    } catch (e) {
      fs.unlink(outputPath, () => {});
      res.status(500).json({ success: false, error: 'Failed to parse conversion result' });
    }
  });
});

router.post('/contact', (req, res) => {
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'All fields are required' });
  }

  console.log('Contact form submission:');
  console.log('Name:', name);
  console.log('Email:', email);
  console.log('Message:', message);

  res.json({ 
    success: true, 
    message: 'Thank you for contacting us! We will get back to you soon.' 
  });
});

module.exports = router;
