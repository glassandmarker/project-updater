const updateBoxFolders = require('./updates/updateBoxFolders');


// Dummy Test Values (Replace with actual data when ready)
const oldProjectId = 'GHX2501';
const oldProjectName = 'Product Video';
const newProjectId = 'COF2501';
const newProjectName = 'Caris RS';

updateBoxFolders(oldProjectId, oldProjectName, newProjectId, newProjectName);