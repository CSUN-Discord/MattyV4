const mongoose = require("mongoose");
const { Schema } = mongoose;

//database table for connect-4 win/losses

const connectSchema = new Schema({
  userId: String,
  wins: Number,
  losses: Number,
});

module.exports = mongoose.model("connect", connectSchema);
