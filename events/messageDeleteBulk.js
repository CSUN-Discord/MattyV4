/*
event that happens when someone deletes multiple messages
 */

const pollFunctions = require("../db/functions/pollFunctions");
const {auditChannelId} = require("../validation/channels.json");
const {MessageEmbed} = require("discord.js");

module.exports = {
    name: "messageDeleteBulk",
    once: false,

    /**
     *
     * @param messages
     */
    execute(messages) {
        const messageTemp = messages.first();
        messages.forEach(message => {
            if (message.partial) message.fetch();
            pollFunctions.deletePoll(message);
        })

        const auditChannel = messageTemp.client.channels.cache.get(auditChannelId);

        try {
            const messageDeletionEmbed = new MessageEmbed()
                .setColor("RANDOM")
                .setAuthor(`${messageTemp.guild.name}`, `${messageTemp.guild.iconURL()}`)
                .setDescription(`Bulk Delete in <#${messageTemp.channelId}>, ${messages.size} messages deleted.`)
                .setTimestamp()

            return auditChannel.send({embeds : [messageDeletionEmbed]})
        } catch (e) {
            return auditChannel.send({content: `A bulk of messages were deleted, but there were problems in retrieving them.`})
        }
    },
};
