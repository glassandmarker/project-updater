const axios = require("axios");

async function updateMonday(oldBoardName, newBoardName) {
  try {
    // Step 1: Get all boards
    const boardsQuery = `
      query {
        boards {
          id
          name
        }
      }
    `;

    const response = await axios.post(
      "https://api.monday.com/v2",
      { query: boardsQuery },
      {
        headers: {
          Authorization: `Bearer ${process.env.MONDAY_ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    const boards = response.data?.data?.boards;
    if (!Array.isArray(boards)) {
      console.error("❌ Failed to get boards list:", JSON.stringify(response.data, null, 2));
      return;
    }

    // Step 2: Find board (with partial match support)
    const boardToRename = boards.find(b =>
      b.name.toLowerCase().includes(oldBoardName.toLowerCase())
    );

    if (!boardToRename) {
      console.error("❌ No board found with name matching:", oldBoardName);
      return;
    }

    // Step 3: Rename the board (correct mutation without { id } block)
    const renameMutation = `
      mutation {
        update_board(board_id: ${boardToRename.id}, board_attribute: name, new_value: "${newBoardName}")
      }
    `;

    const renameResponse = await axios.post(
      "https://api.monday.com/v2",
      { query: renameMutation },
      {
        headers: {
          Authorization: `Bearer ${process.env.MONDAY_ACCESS_TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log(`✅ Renamed board '${boardToRename.name}' → '${newBoardName}' (ID: ${boardToRename.id})`);
    return renameResponse.data;
  } catch (error) {
    console.error("❌ Error renaming board:", error.response?.data || error.message);
  }
}

module.exports = updateMonday;
