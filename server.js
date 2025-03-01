require("dotenv").config();
const express = require("express");
const app = express();

app.use(express.json());

app.post("/webhook", (req, res) => {
    console.log("Webhook received:", req.body);
    res.json({message: "Received webhook!"})
});

const PORT = process.envPORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));