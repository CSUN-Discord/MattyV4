/*
set channel id values command
*/
const channelsFunctions = require("../db/functions/channelsFunctions");
const {MessageEmbed} = require("discord.js");

module.exports = {
    name: "channel",
    description: "View or set channel ids required for various commands.",
    permission: ["ADMINISTRATOR"],
    options: [
        {
            name: "set",
            description: "Set channel ids required for various commands.",
            required: false,
            type: "SUB_COMMAND",
            options: [
                {
                    name: "channel-name",
                    description: "Channel name to set id for.",
                    required: true,
                    type: "STRING",
                    choices: [
                        {
                            name: "marketplace",
                            value: "marketplace",
                        },
                        {
                            name: "roommate",
                            value: "roommate",
                        },
                        {
                            name: "welcome",
                            value: "welcome",
                        },
                        {
                            name: "suggestions",
                            value: "suggestions",
                        },
                        {
                            name: "mod-only",
                            value: "modOnly",
                        },
                        {
                            name: "role-change",
                            value: "roleChange",
                        },
                        {
                            name: "vent",
                            value: "vent",
                        },
                        {
                            name: "planned-meetups",
                            value: "plannedMeetups",
                        },
                        {
                            name: "verified-planned-meetups",
                            value: "verifiedPlannedMeetups",
                        },
                        {
                            name: "audit",
                            value: "audit",
                        },
                        {
                            name: "auto-lofi",
                            value: "autoLofi",
                        }
                    ]
                },
                {
                    name: "channel",
                    description: "Channel to set id of.",
                    required: true,
                    type: "CHANNEL",
                }
            ]
        },
        {
            name: "view",
            description: "View all set channel ids required for various commands.",
            required: false,
            type: "SUB_COMMAND",
        },
    ],


    /**
     *
     * @param interaction
     * @returns {Promise<void>}
     */
    async execute(interaction) {
        await interaction.deferReply({ephemeral: true});
        const channelName = interaction.options.getString("channel-name");
        const channel = interaction.options.getChannel("channel");

        if (interaction.options.getSubcommand() === "set") {
            switch (channelName) {
                case "marketplace":
                    await channelsFunctions.addMarketplace(interaction.guild.id, channel.id)
                    break;
                case "roommate":
                    await channelsFunctions.addRoomate(interaction.guild.id, channel.id)
                    break;
                case "welcome":
                    await channelsFunctions.addWelcome(interaction.guild.id, channel.id)
                    break;
                case "modOnly":
                    await channelsFunctions.addModOnly(interaction.guild.id, channel.id)
                    break;
                case "suggestions":
                    await channelsFunctions.addSuggestion(interaction.guild.id, channel.id)
                    break;
                case "roleChange":
                    await channelsFunctions.addRoleChange(interaction.guild.id, channel.id)
                    break;
                case "vent":
                    await channelsFunctions.addVent(interaction.guild.id, channel.id)
                    break;
                case "plannedMeetups":
                    await channelsFunctions.addPlannedMeetups(interaction.guild.id, channel.id)
                    break;
                case "verifiedPlannedMeetups":
                    await channelsFunctions.addVerifiedPlannedMeetups(interaction.guild.id, channel.id)
                    break;
                case "audit":
                    await channelsFunctions.addAudit(interaction.guild.id, channel.id)
                    break;
                case "autoLofi":
                    await channelsFunctions.addAutoLofi(interaction.guild.id, channel.id)
                    break;
            }

            await interaction.editReply("Channel ID set.")
        } else if (interaction.options.getSubcommand() === "view") {
            let document = await channelsFunctions.getChannelId(interaction.guild.id);
            let marketplace;
            let roommate;
            let welcome;
            let modOnly;
            let suggestions;
            let roleChange;
            let vent;
            let plannedMeetups;
            let verifiedPlannedMeetups;
            let audit;
            let autoLofi;
            if (document.length < 1) {
                marketplace = null;
                roommate = null;
                welcome = null;
                modOnly = null;
                suggestions = null;
                roleChange = null;
                vent = null;
                plannedMeetups = null;
                verifiedPlannedMeetups = null;
                audit = null;
                autoLofi = null;
            } else {
                marketplace = document[0].channels.marketplace || null;
                roommate = document[0].channels.roommate || null;
                welcome = document[0].channels.welcome || null;
                modOnly = document[0].channels.modOnly || null;
                suggestions = document[0].channels.suggestions || null;
                roleChange = document[0].channels.roleChange || null;
                vent = document[0].channels.vent || null;
                plannedMeetups = document[0].channels.plannedMeetups || null;
                verifiedPlannedMeetups = document[0].channels.verifiedPlannedMeetups || null;
                audit = document[0].channels.audit || null;
                autoLofi = document[0].channels.autoLofi || null;
            }

            const channelListEmbed = new MessageEmbed()
                .setColor("RANDOM")
                .setTitle("All channel IDs:")
                .setTimestamp()
                .setDescription(
                    `
                        Marketplace Channel ID: ${marketplace == null ? "Not Set" : marketplace}\n
                        Roommate Channel ID: ${roommate == null ? "Not Set" : roommate}\n
                        Welcome Channel ID: ${welcome == null ? "Not Set" : welcome}\n
                        Mod Only Channel Channel ID: ${modOnly == null ? "Not Set" : modOnly}\n
                        Suggestions Channel Channel ID: ${suggestions == null ? "Not Set" : suggestions}\n
                        Role Change Channel ID: ${roleChange == null ? "Not Set" : roleChange}\n
                        Vent Channel ID: ${vent == null ? "Not Set" : vent}\n
                        Planned Meetups Channel ID: ${plannedMeetups == null ? "Not Set" : plannedMeetups}\n
                        Verified Planned Meetups Channel ID: ${verifiedPlannedMeetups == null ? "Not Set" : verifiedPlannedMeetups}\n
                        Audit Channel ID: ${audit == null ? "Not Set" : audit}\n
                        Auto Lofi Channel ID: ${autoLofi == null ? "Not Set" : autoLofi}\n
                    `
                )
            await interaction.editReply({embeds: [channelListEmbed]});

        } else {
            await interaction.editReply("Command not found.")
        }

    },

};