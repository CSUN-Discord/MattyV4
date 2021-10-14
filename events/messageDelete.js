/*
event that happens when someone deletes a message
 */

const pollFunctions = require("../db/functions/pollFunctions");

module.exports = {
    name: "messageDelete",
    once: false,

    /**
     *
     * @param message
     */
    execute(message) {
        if (message.partial) message.fetch();
        pollFunctions.deletePoll(message);
    },
};
