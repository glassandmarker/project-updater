//updates/updateSlackChannels.js

const axios = require("axios");

const channelTypes = ["post","prod", "gfx","gfx_review"];

async function updateSlackChannels(oldSlug, newSlug, oldId, newId){
    const renamed = [];


try {
    const response = await axios.get("https://slack.com/api/conversations.list", {
        headers: {
            Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
            "Content-Type": "application/json"
        }
    });
    const channels = require.data.channels;

    for (const type of channelTypes) {
        const oldName = `${oldId}-${oldSlug}-${type}`;
        const newName = `${newId}-${newSlug}-${type}`;
        const match = channels.find(ch => ch.name === oldName);
    }

    if (match) {
        await axios.post("https://slack.com/api/conversations.rename", {
            channel: match.id,
            name: newName
        }, {
            headers: {
                Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
                "Content-Type": "application/json"
            }
        });

        renamed.push({old: oldName, new: newName});
    }
    return renamed;
} catch (err){
    console.error("Slack channel update error:", err)
    return [];
}
}
module.exports = updateSlackChannels;


