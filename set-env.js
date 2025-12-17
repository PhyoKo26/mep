// set-env.js
const fs = require('fs');
const path = require('path');

const env = process.env.APP_ENV || 'uat';
const envFile = `.env.${env}`;

// Copy the environment file to .env
fs.copyFileSync(
    path.join(__dirname, envFile),
    path.join(__dirname, '.env')
);

console.log(`Using ${envFile} environment`);