const axios = require("axios");

async function updateMonday(oldProjectId, newProjectName){
  try {
    const boardsQuery = `
      query {
        boards {
          id
          name
        }
      }
    `

    const boardResponse = await axios.post(
      "https://api.monday.com/v2",
      {query: boardsQuery},
      {
        headers: {
          Authorization: `Bearer ${process.env.MONDAY_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    const boards = boardResponse.data.data.boards;

    // Loop through all board and search for item by project_id

    for (const board of boards) {
      const searchQuery = `
        query {
          items_by_column_values(
            board_id: ${board.id},
            column_id: "project_id",
            column_value: "${oldProjectId}"
          ) {
            id
            name
          }
        }
      `;

      const searchResponse = await axios.post(
        "https://api.monday.com/v2",
        {query: searchQuery},
        {
          headers: {
            Authorization: `Bearer ${process.env.MONDAY_API_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      const items = searchResponse.data.data.items_by_column_values;

      if(items.length){
        const itemId = items[0].id;

        // Update the Project Name column

        const updateMutation = `
          mutation {
            change_column_value(
              board_id: ${board.id},
              item_id: ${itemId},
              column_id: "project_name",
              value: "{\\"text\\": \\"${newProjectName}\\"}"
            ) {
              id
            }
          }
        `;
      }

      const updateResponse = await axios.post(
        "https://api.monday.com/v2",
        {query: updateMutation},
        {
          headers: {
            Authorization: `Bearer ${process.env.MONDAY_API_TOKEN}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log(`Updated Project Name in board "${board.name}" (ID: ${board.id}) for item ${itemId}`);
      return updateResponse.data;
    }

    console.log("No matching Project ID found in any board");
} catch (error) {
  console.error("Error updating Monday.com Project Name:", error.response?.data || error.message)
}
}