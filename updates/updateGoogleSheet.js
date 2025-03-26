const {google} = require('googleapis');
const fs = require('fs');
const path = require('path');

// Load service account credentials

const serviceAccount =  require(path.join(__dirname,'../credentials/google-service-account.json'));

// Create the JWT client with domain-wide delegation

const auth = new google.auth.JWT({
    email: serviceAccount.client_email,
    key: serviceAccount.private_key,
    scopes: ['https://www.googleapis.com/auth/drive'],
    subject: 'admin@glassandmarker.com'
})

async function updateGoogleSheet(oldProjectId, oldProjectName, newProjectId, newProjectName){
    // 1. Authenticatre using service account JSON
    // 2. Use Drive Api to search all visible files(type: spreadsheet)
    // 3. For Each file, check if its name includes BOTH oldProjectId, and oldProjectName
    // 4. Rename the file by replacing both in the title
    // 5. Log all changes 
}