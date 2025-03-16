require("dotenv").config();
const axios = require("axios");
const Airtable = require("airtable");
const channelTypes = ["post", "prod", "gfx", "gfx_review"];

const formatProjectSlug = (name) =>
  name.trim().tolowerCase().replace(/\s+/g, "_"); // Converts project name into slack-friendly format
const formatProjectId = (id) => id.trim().tolowerCase(); // Formats the ID into Lowercase

//Function that registers the /update project command with the slack bot
const registerUpdateProjectCommand = (app) => {
  app.command("/update-project", async ({ command, ack, say }) => {
    await ack(); // acknowledge the command
    try {
      const match = command.text.match(/"(.+?)"\s+"(.+?)"\s+"(.+?)"\s+"(.+?)"/); // This regex extracts all parts from users input, if input don't match, it will be null
      if (!match) {
        await say(
          '⚠️ Please use this format:\n`/update-project "Old Project Name" "New Project Name" "Old Project ID" "New Project ID"`'
        );
        return;
      }
      const [
        _,
        oldProjectName,
        newProjectName,
        oldProjectIdRaw,
        newProjectIdRaw,
      ] = match;

      const oldProjectSlug = formatProjectSlug(oldProjectName);
      const newProjectSlug = formatProjectSlug(newProjectName);
      const oldProjectId = formatProjectSlug(oldProjectIdRaw);
      const newProjectId = formatProjectSlug(newProjectIdRaw);

      // Update Slack Channel Names
      await say("🔄 Updating Slack channel names...");
      const updatedChannels = await renameSlackChannels(
        oldProjectName,
        newProjectName,
        oldProjectIdRaw,
        newProjectIdRaw
      );

      // Done!
      await say(
        `✅ Project update complete!• Renamed Slack channels:${updatedChannels
          .map((c) => `  - ${c.old} ➝ ${c.new}`)
          .join("\n")}• Airtable MasterIdList updated successfully.`
      );
    } catch (err) {
      console.error("Error in update-project command:", err);
      await say("❌ Something went wrong. Check the server logs for details.");
    }
  });
};
