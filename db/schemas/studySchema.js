const mongoose = require("mongoose");
const {Schema} = mongoose;

//database table for study users

const studySchema = new Schema({
    userId: String
});

module.exports = mongoose.model("study", studySchema);
