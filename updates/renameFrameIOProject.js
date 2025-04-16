const axios = require("axios");
require("dotenv").config();

async function renameFrameIOProjects(
  token,
  oldProjectId,
  oldProjectName,
  newProjectId,
  newProjectName
) {

  const TEAM_ID = process.env.FRAME_IO_TEAM_ID;
  if(!TEAM_ID || !token){
    console.error("Missing TEAM_ID or token");
    return;
  }
  
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