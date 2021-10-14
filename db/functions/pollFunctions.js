const pollSchema = require("../schemas/pollSchema");

module.exports = {
    addPoll: async function (messageId) {
        try {
            await pollSchema
                .findOneAndUpdate(
                    {
                        messageId: messageId,
                    },
                    {

                    },
                    {
                        upsert: true,
                    }
                )
                .exec();
        } catch (e) {
            console.log(e);
        }
    },
    updateReactions: function (reaction, user, addedReaction) {
        try {
            pollSchema
                .findOne(
                    {
                        messageId: reaction.message.id,
                    },
                )
                .then((poll) => {
                    if (poll == null) return;
                    else {
                        if (addedReaction) {
                            //reaction was added
                            if (poll.userWhoReacted.includes(user.id)) {
                                // console.log("already reacted, remove reaction from message")
                                reaction.users.remove(user)
                                reaction.message.channel.send(`<@!${user.id}>, you've already voted, please remove a reaction to vote again.`).then((msg) => {
                                    setTimeout(() => msg.delete(), 5000);
                                })
                            }
                            else {
                                // console.log("add user to db poll array")
                                addUser(reaction.message.id, user.id)
                            }
                        }
                        else {
                            let currentlyReacted = false;
                            reaction.message.reactions.cache.forEach(reaction => {
                                if (reaction.users.cache.has(user.id)) {
                                    currentlyReacted = true;
                                }
                            })
                            if (currentlyReacted) return;
                            if (reaction.message.reactions.cache.has(user)) return;
                            if (poll.userWhoReacted.includes(user.id)) {
                                // console.log("remove reaction from db array")
                                removeUser(reaction.message.id, user.id)
                            }
                            else {
                                // console.log("user removed reaction from msg but wasnt in the db, not possible")
                            }
                        }
                    }
                })
        } catch (e) {
            console.log(e);
        }
    },

    deletePoll: function (message) {
        try {
            pollSchema
                .findOneAndDelete(
                    {
                        messageId: message.id,
                    },
                    (err, data) => {
                        if (err) {
                            console.log(err);
                        } else {
                        }
                    }
                );
        } catch (e) {}
    },
};

 function addUser (messageId, userId) {
    try {
        pollSchema
            .findOneAndUpdate(
                {
                    messageId: messageId,
                },
                {
                    $push: { userWhoReacted: userId  }
                },
            )
            .then((error, success) => {
            })
    } catch (e) {
        console.log(e);
    }
}

function removeUser (messageId, userId) {
    try {
        pollSchema
            .findOneAndUpdate(
                {
                    messageId: messageId,
                },
                {
                    $pull: { userWhoReacted: userId  }
                },
            )
            .then((error, success) => {
            })
    } catch (e) {
        console.log(e);
    }
}