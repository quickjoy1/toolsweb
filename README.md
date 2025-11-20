# DocConvert - Document Conversion Tool

A web-based document conversion application that provides PDF to Word and JPG to PDF conversion services.

## Features

- **PDF to Word**: Convert PDF documents to editable Word files (.docx)
- **JPG to PDF**: Convert multiple JPG/PNG images to a single PDF document
- **Drag & Drop Interface**: Easy file upload with drag-and-drop support
- **Session Management**: Secure file handling with automatic cleanup
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

### Frontend
- Node.js with Express.js
- EJS templating engine
- Vanilla JavaScript
- Custom CSS with modern design

### Backend
- Express.js REST API
- Python for file conversion
- Multer for file uploads
- express-session for session management

### Python Libraries
- pdf2docx - PDF to Word conversion
- Pillow & img2pdf - Image to PDF conversion
- PyPDF2 - PDF manipulation

## Installation

1. Install dependencies:
```bash
npm install
pip install -r python/requirements.txt
```

2. Start the server:
```bash
npm start
```

3. Access the application:
```
http://localhost:5000
```

## Configuration

The application can be configured by modifying `config/config.js`. Key settings include:

- `WEBSITE_NAME`: Change the application name throughout the site
- `PORT`: Server port (default: 5000)
- `MAX_FILE_SIZE`: Maximum upload file size
- `SESSION_MAX_AGE`: Session expiration time

## Pages

- **Home** (`/`): Main landing page with tool selection
- **PDF to Word** (`/pdf-to-word`): PDF to Word conversion tool
- **JPG to PDF** (`/jpg-to-pdf`): Image to PDF conversion tool
- **About** (`/about`): Information about the service
- **Contact** (`/contact`): Contact form

## API Endpoints

- `POST /api/convert/pdf-to-word`: Convert PDF to Word
- `POST /api/convert/jpg-to-pdf`: Convert images to PDF
- `POST /api/contact`: Submit contact form

## Privacy & Security

- All uploaded files are automatically deleted after conversion
- No files are stored or shared
- Session-based file management for security

## License

ISC
