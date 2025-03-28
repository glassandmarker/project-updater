const {google} = require('googleapis');
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
    try {
        console.log("🔐 Loaded Service Account:", serviceAccount.client_email);
        // Authorize the service account
        await auth.authorize();

        // Create a Drive Api Client
        const drive = google.drive({version: "v3", auth})
        
       

        // List spreadsheet files
        const res = await drive.files.list({
            q: "mimeType='application/vnd.google-apps.spreadsheet'",
            fields: 'files(id,name)',
            pageSize: 1000
        });

        const files = res.data.files;

        if(!files.length) {
            console.log('No Spreadsheet files found')
            return;
        }

        // Filter and rename matching files
        for (const file of files) {
            const {id, name} = file;

            if(name.includes(oldProjectId) && name.includes(oldProjectName)){
                const newName = name.replace(oldProjectId, newProjectId).replace(oldProjectName, newProjectName)

                await drive.files.update({
                    fileId: id,
                    requestBody: {
                        name: newName
                    }
                });

                console.log(`Renamed: "${name}" -> "${newName}"`);
            }
        }
    } catch (error) {
        console.error('Error updating Google Sheets files:', error.message || error);
    }
}

module.exports = updateGoogleSheet;