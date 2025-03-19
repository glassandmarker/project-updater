const updateSlackChannels = require('./updates/updateSlackChannels');
const updateAirtableProjectRecord = require('./updates/updateAirtable');
const updateMondayProject = require('./updates/updateMonday')

const formatProjectSlug = (name) => name.trim().toLowerCase().replace(/\s+/g, "_");
const formatProjectId = (id) => id.trim().toLowerCase();

const registerUpdateProjectCommand = (app) => {
  app.command("/update-project", async ({ command, ack, say }) => {
    await ack();

    try {
      const match = command.text.match(/"(.+?)"\s+"(.+?)"\s+"(.+?)"\s+"(.+?)"/);
      if (!match) {
        await say("⚠️ Format: `/update-project \"Old Name\" \"New Name\" \"Old ID\" \"New ID\"`");
        return;
      }

      const [_, oldName, newName, oldIdRaw, newIdRaw] = match;
      const oldSlug = formatProjectSlug(oldName);
      const newSlug = formatProjectSlug(newName);
      const oldId = formatProjectId(oldIdRaw);
      const newId = formatProjectId(newIdRaw);

      await say("🔄 Updating Slack channels...");
      const renamed = await updateSlackChannels(oldSlug, newSlug, oldId, newId);

      await say("📄 Updating Airtable MasterIdList...");
      await updateAirtableProjectRecord(oldName, newName, oldIdRaw, newIdRaw);

      await say("🔄 Updating Monday.com board...")
      await updateMondayProject(oldId, newId,oldName, newName);

      await say(`✅ Update Complete!\n${renamed.map(r => `• ${r.old} ➝ ${r.new}`).join('\n')}`);
    } catch (err) {
      console.error("Update error:", err);
      await say("❌ Something went wrong. Check logs.");
    }
  });
};

module.exports = { registerUpdateProjectCommand };
