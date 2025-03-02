const axios = require("axios");
const channelTypes = ["post","prod", "gfx", "gfx_review"];

async function findChannelId(channelName){
    try {
        const response = await axios.get("https://slack.com/api/conversations.list", {
            headers: {
                Authorization: `Bearer ${process.env.SLACK_BOT_TOKEN}`,
                "Content-Type": "application/json"
            }
        });

        const channels = response.data.channels;
        return channels.find(ch => ch.name === channelName)?.id || null;
    } catch (error){
        console.error("Error fetching Slack channels", error);
        return null;
    }}