/*
This command will allow you to start a giveaway
*/

const {CommandInteraction, MessageEmbed} = require("discord.js");
const {client} = require("../index")
const ms = require("ms");

module.exports = {
    name: "giveaway",
    description: "Start a giveaway.",
    permission: ["SEND_MESSAGES"],
    options: [
        {
            name: "start",
            description: "Start a giveaway.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "channel",
                    description: "Select a channel for the giveaway.",
                    type: "CHANNEL",
                    required: true,
                },
                {
                    name: "duration",
                    description: "Provide a duration for this giveaway (1m, 1h, 1d)",
                    type: "STRING",
                    required: true,
                },
                {
                    name: "description",
                    description: "What is the giveaway item?",
                    type: "STRING",
                    required: true,
                },
                {
                    name: "winners",
                    description: "How many winners for this giveaway?",
                    type: "INTEGER",
                    required: true,
                },
                {
                    name: "sponsor",
                    description: "Who is the sponsor of this giveaway?",
                    type: "USER",
                    required: false,
                },
            ],
        },
        {
            name: "actions",
            description: "Options for giveaways",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "options",
                    description: "Select an option.",
                    type: "STRING",
                    required: true,
                    choices: [
                        {
                            name: "end",
                            value: "end",
                        },
                        {
                            name: "pause",
                            value: "pause",
                        },
                        {
                            name: "unpause",
                            value: "unpause",
                        },
                        {
                            name: "re-roll",
                            value: "re-roll",
                        },
                        {
                            name: "delete",
                            value: "delete",
                        },
                    ],
                },
                {
                    name: "msg-id",
                    description: "The message id for this giveaway.",
                    type: "STRING",
                    required: true,
                },
            ],
        },
    ],

    /**
     *
     * @param {CommandInteraction} interaction
     * @returns {Promise<void>}
     */

    async execute(interaction) {
        const {options} = interaction;

        const Sub = options.getSubcommand();

        const errorEmbed = new MessageEmbed()
            .setColor("RED")

        const successEmbed = new MessageEmbed()
            .setColor("GREEN")

        switch (Sub) {
            case "start":

                const channel = options.getChannel("channel");
                const duration = options.getString("duration");
                const winnerCount = options.getInteger("winners");
                const prize = options.getString("description");
                const sponsor = options.getUser("sponsor") || interaction.user;

                client.giveawaysManager.start(channel, {
                    duration: ms(duration),
                    winnerCount: winnerCount,
                    prize: prize,
                    hostedBy: sponsor,
                    lastChance: {
                        enabled: true,
                        threshold: 30000
                    }
                }).then(async () => {
                    successEmbed.setDescription("Giveaway was successfully started.")
                    return interaction.reply({embeds: [successEmbed], ephemeral: true})
                }).catch((err) => {
                    console.log(err)
                    errorEmbed.setDescription(`An error has occurred. ${err}`)
                    return interaction.reply({embeds: [errorEmbed], ephemeral: true})
                })
                break;

            case "actions":
                const choice = options.getString("options");
                const messageId = options.getString("msg-id")
                const giveaway = client.giveawaysManager.giveaways.find((g) => g.guildId === interaction.guildId && g.messageId === messageId);

                if (!giveaway) {
                    errorEmbed.setDescription(`Unable to find the giveaway with the message id: ${messageId} in this guild.`)
                    return interaction.reply({embeds: [errorEmbed], ephemeral: true})
                }

                switch (choice) {
                    case "end":
                        client.giveawaysManager.end(messageId).then(() => {
                            successEmbed.setDescription("Giveaway has been ended.")
                            return interaction.reply({embeds: [successEmbed], ephemeral: true})
                        }).catch((err) => {
                            errorEmbed.setDescription(`An error has occurred. ${err}`)
                            return interaction.reply({embeds: [errorEmbed], ephemeral: true})
                        });
                        break;
                    case "pause":
                        client.giveawaysManager.pause(messageId).then(() => {
                            successEmbed.setDescription("Giveaway has been paused.")
                            return interaction.reply({embeds: [successEmbed], ephemeral: true})
                        }).catch((err) => {
                            errorEmbed.setDescription(`An error has occurred. ${err}`)
                            return interaction.reply({embeds: [errorEmbed], ephemeral: true})
                        });
                        break;
                    case "unpause":
                        client.giveawaysManager.unpause(messageId).then(() => {
                            successEmbed.setDescription("Giveaway has been un-paused.")
                            return interaction.reply({embeds: [successEmbed], ephemeral: true})
                        }).catch((err) => {
                            errorEmbed.setDescription(`An error has occurred. ${err}`)
                            return interaction.reply({embeds: [errorEmbed], ephemeral: true})
                        });
                        break;
                    case "re-roll":
                        client.giveawaysManager.reroll(messageId).then(() => {
                            successEmbed.setDescription("User has been rerolled.")
                            return interaction.reply({embeds: [successEmbed], ephemeral: true})
                        }).catch((err) => {
                            errorEmbed.setDescription(`An error has occurred. ${err}`)
                            return interaction.reply({embeds: [errorEmbed], ephemeral: true})
                        });
                        break;
                    case "delete":
                        client.giveawaysManager.delete(messageId).then(() => {
                            successEmbed.setDescription("Giveaway has been deleted.")
                            return interaction.reply({embeds: [successEmbed], ephemeral: true})
                        }).catch((err) => {
                            errorEmbed.setDescription(`An error has occurred. ${err}`)
                            return interaction.reply({embeds: [errorEmbed], ephemeral: true})
                        });
                        break;
                    default: {
                        console.log("Error in giveaway command.")
                    }
                }
                break;

            default: {
                console.log("Error in giveaway command.")
            }
        }
    },
};
