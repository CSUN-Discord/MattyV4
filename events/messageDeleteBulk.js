/*
event that happens when someone deletes multiple messages
 */

const pollFunctions = require("../db/functions/pollFunctions");

module.exports = {
    name: "messageDeleteBulk",
    once: false,

    /**
     *
     * @param messages
     */
    execute(messages) {
        messages.forEach(message => {
            if (message.partial) message.fetch();
            pollFunctions.deletePoll(message);
        })
    },
};
