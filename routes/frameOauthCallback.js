const axios = require("axios");

function registerFrameIOCallbackRoute(router) {
  router.get("/oauth/callback", async (req, res) => {
    const code = req.query.code;
    if (!code) return res.status(400).send("Missing ?code");

    try {
      const response = await axios.post(
        "https://applications.frame.io/oauth2/token",
        new URLSearchParams({
          grant_type: "authorization_code",
          code,
          client_id: process.env.FRAME_CLIENT_ID,
          client_secret: process.env.FRAME_CLIENT_SECRET,
          redirect_uri: process.env.FRAME_REDIRECT_URI, 
        }),
        {
          headers: { "Content-Type": "application/x-www-form-urlencoded" }, 
        }
      );

      const token = response.data.access_token;
      console.log("✅ Frame.io Access Token:", token);

      res.send("✅ OAuth successful! Access token logged.");
    } catch (error) {
      console.error("❌ OAuth error:", error.response?.data || error.message);
      res.status(500).send("OAuth failed");
    }
  });
}

module.exports = { registerFrameIOCallbackRoute }; 
