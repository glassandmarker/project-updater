require("dotenv").config();
const axios = require("axios");

async function renameBoard() {
  const oldBoardId = 123456789; // replace with your real board ID
  const newBoardName = "Coffee RS";

  console.log("🔐 MONDAY TOKEN:", process.env.MONDAY_API_KEY); // sanity check

  const mutation = `
    mutation {
      change_board_name (board_id: ${oldBoardId}, new_name: "${newBoardName}") {
        id
      }
    }
  `;

  try {
    const response = await axios.post(
      "https://api.monday.com/v2",
      { query: mutation },
      {
        headers: {
          Authorization: `Bearer ${process.env.MONDAY_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("✅ Board renamed:", response.data);
  } catch (error) {
    console.error("❌ Failed:", error.response?.data || error.message);
  }
}

renameBoard();

