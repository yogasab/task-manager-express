const mongoose = require("mongoose");
require("dotenv/config");

// Test
mongoose.connect(process.env.DB_HOST);
// Dev
// mongoose.connect("mongodb://127.0.0.1:27017/task-manager-api");
