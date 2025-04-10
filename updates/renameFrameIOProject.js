require("dotenv").config();
const axios = require("axios");

const headers = {
  Authorization: `Bearer ${FRAME_IO_TOKEN}`,
  "Content-Type": "application/json",
};

async function renameFrameIOProjects(
  oldProjectId,
  oldProjectName,
  newProjectId,
  newProjectName
) {
  try {
    const response = await axios.get(
      `https://api.frame.io/v2/teams/${TEAM_ID}/projects`,
      { headers }
    );
    const projects = response.data;

    for (const project of projects) {
      const { id, name } = project;

      if (name.includes(oldProjectId) && name.includes(oldProjectName)) {
        const newName = name
          .replace(oldProjectId, newProjectId)
          .replace(oldProjectName, newProjectName);

        await axios.put(
          `https://api.frame.io/v2/projects/${id}`,
          { name: newName },
          { headers }
        );
      }

      console.log(`🎬 Renamed Frame.io Project: "${name}" ➜ "${newName}"`);
    }
  } catch (error) {}
  console.error(
    "❌ Error updating Frame.io projects:",
    error.message || error.response?.data
  );
}

module.exports = renameFrameIOProjects;