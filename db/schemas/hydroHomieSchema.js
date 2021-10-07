const mongoose = require("mongoose");
const { Schema } = mongoose;

//database table for hydro homie

const hydroHomieSchema = new Schema({
  userId: String,
  timer: Array,
  waterDrank: Number,
  reminder: Boolean,
});

module.exports = mongoose.model("hydroHomie", hydroHomieSchema);
