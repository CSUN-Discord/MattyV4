const mongoose = require("mongoose");
const { Schema } = mongoose;

//database table for giveaways

const giveawaySchema = new Schema({
    messageId: String,
    winners: Number,
    time: Array,
    channelId: String,
    description: String,
    sponsorId: String
});

module.exports = mongoose.model("giveaway", giveawaySchema);
