const BoxSDK = require("box-node-sdk");
const path = require("path");

// Loading box config file
const boxConfig = path.join(__dirname, "../credentials/box-config.json");
const sdk = BoxSDK.getPreconfiguredInstance(require(boxConfig));

// Use the Enterprise-level client

const client = sdk.getAppAuthClient("enterprise");

// Function to Rename Folders && Files
async function updateBoxFolders(
  oldProjectId,
  oldProjectName,
  newProjectId,
  newProjectName
) {
  const renamed = { folder: false, file: false };

  async function traverse(folderId) {
    const items = await client.folders.getItems(folderId, {
      fields: "name,type",
      limit: 1000,
    });

    for (const item of items.entries) {
      const { id, name, type } = item;
      console.log(`🔍 Found ${type}: "${name}"`);
      if (name.includes(oldProjectId) && name.includes(oldProjectName)) {
        const newName = name
          .replace(oldProjectId, newProjectId)
          .replace(oldProjectName, newProjectName);

        if (type === "folder" && !renamed.folder) {
          await client.folders.update(id, { name: newName });
          console.log(`Renamed folder: "${name}" --> "${newName}"`);
          renamed.folder = true;
        }

        if (type === "file" && !renamed.file) {
          await client.files.update(id, { name: newName });
          console.log(`Renamed file: "${name}" --> "${newName}"`);
          renamed.file = true;
        }
        if (renamed.folder && renamed.file) return;

        if (type === "folder") {
          await traverse(id);
          if (renamed.folder && renamed.file) return;
        }
      }
    }
  }
  try {
    await traverse("0"); // You start at root folder
  } catch (error) {
    console.error("Error renaming Box folders/files", error.message || error);
  }
}

module.exports = updateBoxFolders;
