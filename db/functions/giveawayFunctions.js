const giveawaySchema = require("../schemas/giveawaySchema");
const schedule = require('node-schedule');
const {client} = require("../../index")
const {MessageEmbed} = require("discord.js");

module.exports = {
    addGiveaway: async function (messageId, winners, time, channelId,  description, sponsorId) {
        try {
            await giveawaySchema
                .findOneAndUpdate(
                    {
                        messageId: messageId,
                    },
                    {
                        $set : {
                            winners: winners,
                            time: time,
                            channelId: channelId,
                            description: description,
                            sponsorId: sponsorId
                        }
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

    loadGiveaways: function () {
        try {
            giveawaySchema
                .find(
                    {},
                    (err, data) => {
                        if (err)
                            console.log(`err ${err}`)
                        else {
                            for (let i = 0;i<data.length;i++){
                                this.startSchedule(data[i].messageId, data[i].winners, data[i].time, data[i].channelId, data[i].description, data[i].sponsorId);
                            }
                        }
                    }
                )
        } catch (e) {
            console.log(e);
        }
    },

    startSchedule: function (messageId, winners, time, channelId, description, sponsorId) {

        const date = new Date(time[0], time[1], time[2], time[3], time[4], 0);

        const job = schedule.scheduleJob(date, function(){
            const giveawayChannel = client.channels.cache.get(channelId)

            let winnersMsg = '';

            giveawayChannel.messages.fetch(messageId).then(async reactionMessage => {
                reactionMessage.reactions.cache.map(async (reaction) => {
                    const usersThatReacted = [];
                    let usersWhoWon = [];

                    if (reaction.emoji.name !== "🎉") return;
                    const reactedUsers = await reaction.users.fetch();
                    reactedUsers.map((user) => {
                        if (user.bot) {
                            return;
                        }
                        usersThatReacted.push(user);
                    });

                    if (usersThatReacted.length >= winners) {
                        for (let i = 0; i < winners; i++) {
                            const user = usersThatReacted.splice(Math.floor((Math.random() * usersThatReacted.length)), 1);
                            usersWhoWon.push(user)
                        }
                    } else {
                        for (let i = 0; i < usersThatReacted.length; i++) {
                            usersWhoWon.push(usersThatReacted[i])
                        }
                    }

                    usersWhoWon.map(user => winnersMsg += `${user}, `)

                    const sponsor = await client.users.fetch(sponsorId);

                    const giveawayEmbed = new MessageEmbed()
                        .setTitle("Giveaway Over!")
                        .setDescription(`Congratulations: ${winnersMsg} please message ${sponsor} for your ${description}.`)
                        .setTimestamp()

                    reactionMessage.edit({embeds: [giveawayEmbed]});


                })
            });
            removeGiveaway(messageId);
        });
    },
};

function removeGiveaway (messageId) {
    try {
        giveawaySchema
            .findOneAndDelete(
                {
                    messageId: messageId,
                },
                {

                },
                (err, response) => {
                    if (err)
                        console.log(err)
                }
            )
    } catch (e) {
        console.log(e);
    }
}