const mongoose = require("mongoose");
const { Schema } = mongoose;

//database table for polls

const pollSchema = new Schema({
    messageId: String,
    userWhoReacted: Array,
}, {
        timestamps: { createdAt: 'created_at' }
    });

module.exports = mongoose.model("polls", pollSchema);
