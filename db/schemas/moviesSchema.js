const mongoose = require("mongoose");
const { Schema } = mongoose;

//database table for movies

const moviesSchema = new Schema({
  name: String,
});

module.exports = mongoose.model("movies", moviesSchema);
