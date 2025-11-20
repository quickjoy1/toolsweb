const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const config = require('./config/config');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.use(session({
  secret: config.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: config.SESSION_MAX_AGE }
}));

fs.mkdirSync(config.UPLOAD_DIR, { recursive: true });
fs.mkdirSync(config.RESULTS_DIR, { recursive: true });

const indexRoutes = require('./routes/index');
const apiRoutes = require('./routes/api');

app.use('/', indexRoutes);
app.use('/api', apiRoutes);

const PORT = config.PORT;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`${config.WEBSITE_NAME} server running on port ${PORT}`);
});
