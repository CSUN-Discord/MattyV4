/*
event that listens for message creation
 */

const channelsFunctions = require("../db/functions/channelsFunctions.js");

module.exports = {
    name: "messageCreate",

    /**
     *
     * @param message
     * @returns {Promise<void>}
     */
    async execute(message) {
        const channelIds = await channelsFunctions.getChannelId(message.guild.id);
        const marketplaceChannelId = channelIds[0].channels.marketplace || null;
        const roommateChannelId = channelIds[0].channels.roommate || null;
        const welcomeChannelId = channelIds[0].channels.welcome || null;
        const ventChannelId = channelIds[0].channels.vent || null;

        if (marketplaceChannelId != null) {
            if (message.channel.id === marketplaceChannelId && !message.author.bot) {
                message
                    .reply("Use the slash command **/marketplace**.")
                    .then((msg) => {
                        setTimeout(() => msg.delete(), 10000);
                        message.delete();
                    })
                    .catch();
            }
        }

        if (roommateChannelId != null) {
            if (message.channel.id === roommateChannelId && !message.author.bot) {
                message
                    .reply("Use the slash command **/roommate**.")
                    .then((msg) => {
                        setTimeout(() => msg.delete(), 10000);
                        message.delete();
                    })
                    .catch();
            }
        }

        if (welcomeChannelId != null) {
            if (
                message.channel.id === welcomeChannelId &&
                !message.author.bot &&
                !message.member.roles.cache.some((role) => role.name === "Admin") &&
                !message.member.roles.cache.some((role) => role.name === "Mod") &&
                !message.member.roles.cache.some((role) => role.name === "Helpers")
            ) {
                message
                    .reply("Use the slash command **/answer-the-bot**.")
                    .then((msg) => {
                        setTimeout(() => msg.delete(), 10000);
                        message.delete();
                    })
                    .catch();
            }
        }

        if (ventChannelId != null) {
            if (
                message.channel.id === ventChannelId &&
                !message.author.bot &&
                !message.member.roles.cache.some((role) => role.name === "Admin") &&
                !message.member.roles.cache.some((role) => role.name === "Mod") &&
                !message.member.roles.cache.some((role) => role.name === "Helpers")
            ) {
                message.delete();
            }
        }
    },
};
