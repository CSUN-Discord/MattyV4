const mongoose = require("mongoose");
const { Schema } = mongoose;

//database table for birthdays

const birthdaySchema = new Schema({
  userId: String,
  month: Number,
  day: Number,
});

module.exports = mongoose.model("birthday", birthdaySchema);
