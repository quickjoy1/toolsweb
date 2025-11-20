# DocConvert - Document Conversion Tool

## Overview
A full-stack web application for document conversion with PDF to Word and JPG to PDF functionality. Built with Node.js/Express frontend and Python backend processing.

## Project Structure
- `server.js` - Main Express server
- `config/config.js` - Configuration settings
- `routes/` - Express route handlers
- `views/` - EJS templates
- `public/` - Static assets (CSS, JS)
- `python/` - Python conversion scripts

## Recent Changes (Nov 20, 2024)
- Initial project setup
- Implemented PDF to Word conversion using pdf2docx
- Implemented JPG to PDF conversion using img2pdf
- Created responsive UI with custom color scheme (indigo, emerald, amber)
- Added home, conversion tools, about, and contact pages
- Integrated Node.js with Python via python-shell
- Session-based file management with automatic cleanup

## Technologies
- Frontend: Node.js, Express, EJS, Vanilla JS
- Backend: Python 3.11
- Libraries: pdf2docx, Pillow, img2pdf, PyPDF2
- Session: express-session
- File Upload: Multer

## Configuration
Website name and settings configurable via `config/config.js`
