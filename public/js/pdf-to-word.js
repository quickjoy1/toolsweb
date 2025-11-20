const uploadArea = document.getElementById('uploadArea');
const pdfFileInput = document.getElementById('pdfFile');
const fileList = document.getElementById('fileList');
const processing = document.getElementById('processing');
const resultSection = document.getElementById('resultSection');
const successIcon = document.getElementById('successIcon');
const errorIcon = document.getElementById('errorIcon');
const resultTitle = document.getElementById('resultTitle');
const resultMessage = document.getElementById('resultMessage');
const downloadBtn = document.getElementById('downloadBtn');

uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
  uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadArea.classList.remove('dragover');
  const files = e.dataTransfer.files;
  if (files.length > 0) {
    pdfFileInput.files = files;
    handleFileSelect();
  }
});

pdfFileInput.addEventListener('change', handleFileSelect);

function handleFileSelect() {
  const file = pdfFileInput.files[0];
  if (!file) return;

  if (!file.name.toLowerCase().endsWith('.pdf')) {
    alert('Please select a PDF file');
    return;
  }

  fileList.innerHTML = `
    <div class="file-item">
      <span class="file-name">${file.name}</span>
      <span class="file-size">${formatFileSize(file.size)}</span>
    </div>
  `;

  convertPDF(file);
}

function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

async function convertPDF(file) {
  uploadArea.style.display = 'none';
  processing.style.display = 'block';

  const formData = new FormData();
  formData.append('pdfFile', file);

  try {
    const response = await fetch('/api/convert/pdf-to-word', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    processing.style.display = 'none';
    resultSection.style.display = 'block';

    if (result.success) {
      successIcon.style.display = 'block';
      errorIcon.style.display = 'none';
      resultTitle.textContent = 'Conversion Successful!';
      resultMessage.textContent = result.message || 'Your PDF has been converted to Word format.';
      downloadBtn.href = result.downloadUrl;
      downloadBtn.download = result.filename;
      downloadBtn.style.display = 'inline-block';
    } else {
      successIcon.style.display = 'none';
      errorIcon.style.display = 'block';
      resultTitle.textContent = 'Conversion Failed';
      resultMessage.textContent = result.error || 'An error occurred during conversion.';
      downloadBtn.style.display = 'none';
    }
  } catch (error) {
    processing.style.display = 'none';
    resultSection.style.display = 'block';
    successIcon.style.display = 'none';
    errorIcon.style.display = 'block';
    resultTitle.textContent = 'Conversion Failed';
    resultMessage.textContent = 'Network error. Please try again.';
    downloadBtn.style.display = 'none';
  }
}
