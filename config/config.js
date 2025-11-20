require('dotenv').config();

module.exports = {
  WEBSITE_NAME: process.env.WEBSITE_NAME || 'DocConvert',
  PORT: process.env.PORT || 5000,
  SESSION_SECRET: process.env.SESSION_SECRET || 'fallback-secret',
  PYTHON_PATH: process.env.PYTHON_PATH || 'python3',
  UPLOAD_DIR: process.env.UPLOAD_DIR || './public/uploads',
  RESULTS_DIR: process.env.RESULTS_DIR || './public/results',
  SESSION_MAX_AGE: parseInt(process.env.SESSION_MAX_AGE) || 1800000,
  MAX_FILE_SIZE: 10 * 1024 * 1024
};
