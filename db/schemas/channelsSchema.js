const mongoose = require("mongoose");
const {Schema} = mongoose;

//database table for the channels in each guild

const channelsSchema = new Schema({
    guildId: String,
    channels: {
        marketplace: String,
        roommate: String,
        welcome: String,
        modOnly: String,
        suggestions: String,
        roleChange: String,
        vent: String,
        plannedMeetups: String,
        verifiedPlannedMeetups: String,
        audit: String,
        autoLofi: String
    }
});

module.exports = mongoose.model("channels", channelsSchema);
