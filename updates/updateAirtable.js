// updates/updateAirtable.js

const Airtable = require("airtable");

async function updateAirtableProjectRecord(oldName, newName, oldId, newId) {
  const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
    process.env.AIRTABLE_BASE_ID
  );
  const table = base(process.env.AIRTABLE_TABLE_NAME);

  const records = await table.select().all();
  const match = records.find(
    (r) => r.get("ProjectName") === oldName && r.get("ProjectId") === oldId
  );

  if (!match) throw new Error("No matching Airtable project record found.");

  await table.update(match.id, {
    ProjectName: newName,
    ProjectId: newId,
    PreviousProjectId: oldId,
  });
}

module.exports = updateAirtableProjectRecord;
