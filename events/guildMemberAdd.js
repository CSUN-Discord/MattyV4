/*
event that listens for new members
 */

const channelsFunctions = require("../db/functions/channelsFunctions.js");

module.exports = {
    name: "guildMemberAdd",

    /**
     *
     * @param member
     * @returns {Promise<void>}
     */
    async execute(member) {
        member.roles.add(
            member.guild.roles.cache.find((role) => role.name === "AnswerTheBot")
        );

        const channelIds = await channelsFunctions.getChannelId(member.guild.id);
        const welcomeChannelId = channelIds[0].channels.welcome || null;

        if (welcomeChannelId == null)
            return;

        const welcomeChannel = member.client.channels.cache.get(welcomeChannelId);

        if (welcomeChannel.type !== "GUILD_TEXT") {
            return;
        }

        welcomeChannel.send(
            `Welcome ${member.user}! \n To access all channels please use the command **/answer-the-bot** and wait while 
        someone from the mod team lets you in the server.`
        );
    },
};
