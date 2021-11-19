/*
set channel id values command
*/
const channelsFunctions = require("../db/functions/channelsFunctions");

module.exports = {
    name: "set-channel",
    description: "Set channel ids required for various commands.",
    permission: ["ADMINISTRATOR"],
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

    },

};