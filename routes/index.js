const express = require('express');
const router = express.Router();
const config = require('../config/config');

router.get('/', (req, res) => {
  res.render('index', { 
    title: config.WEBSITE_NAME,
    websiteName: config.WEBSITE_NAME
  });
});

router.get('/pdf-to-word', (req, res) => {
  res.render('pdf-to-word', { 
    title: `PDF to Word - ${config.WEBSITE_NAME}`,
    websiteName: config.WEBSITE_NAME
  });
});

router.get('/jpg-to-pdf', (req, res) => {
  res.render('jpg-to-pdf', { 
    title: `JPG to PDF - ${config.WEBSITE_NAME}`,
    websiteName: config.WEBSITE_NAME
  });
});

router.get('/contact', (req, res) => {
  res.render('contact', { 
    title: `Contact Us - ${config.WEBSITE_NAME}`,
    websiteName: config.WEBSITE_NAME
  });
});

router.get('/about', (req, res) => {
  res.render('about', { 
    title: `About Us - ${config.WEBSITE_NAME}`,
    websiteName: config.WEBSITE_NAME
  });
});

module.exports = router;
