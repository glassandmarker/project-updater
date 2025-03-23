require("dotenv").config();
const updateMonday = require("./updates/updateMonday")

const oldProjectId = "NAV2501 - Project Navan Product Video"
const newProjectName = "Coffee RS"

updateMonday(oldProjectId, newProjectName);