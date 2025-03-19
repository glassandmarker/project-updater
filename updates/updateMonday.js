const axios = require("axios");

async function updateMondayProject(oldId, newId, OldName, newName) {
  try {
    const mutation = `
          mutation {
            change_board_name (board_id: ${oldId}, new_name: "${newName}") {
              id
            }
          }
        `;

    const response = await axios.post(
      "https://api.monday.com/v2",
      { query: mutation },
      {
        headers: {
          Authorization: process.env.MONDAY_API_TOKEN,
          "Content-Type": "application/json",
        },
      }
    );
    console.log(`Renamed Monday.com board from "${oldName}" to "${newName}"` );
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error updating Monday.com board:",
      error.response?.data || error.message
    );
  }
}

module.exports = updateMondayProject;
