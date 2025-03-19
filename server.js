require("dotenv").config();
const {App} = require("@slack/bolt");
const {registerUpdateProjectCommand} = require("./updateProjectCommand");

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET
});

registerUpdateProjectCommand(app);

(async () => {
    await app.start(process.env.PORT || 3000);
    console.log("Slack bot is running")
})();