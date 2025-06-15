const fs = require('fs');
const https = require('https');
const express = require('express');
const path = require('path');

const app = express();

// מיקום תיקיית האתר שלך
const publicDir = path.join(__dirname, '.');
app.use(express.static(publicDir));

// יצירת שרת HTTPS עם הקבצים של mkcert
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, 'ssl/localhost-key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'ssl/localhost.pem')),
};

// האזנה על פורט 3000
https.createServer(sslOptions, app).listen(3000, () => {
  console.log('✅ HTTPS Server running at https://localhost:3000');
});
