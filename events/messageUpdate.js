/*
Emitted whenever a message is updated - e.g. embed or content change.
 */

const {auditChannelId} = require("../validation/channels.json");
const {MessageEmbed} = require("discord.js");

module.exports = {
    name: "messageUpdate",
    once: false,

    /**
     *
     * @param oldMessage
     * @param newMessage
     * @returns {Promise<*>}
     */

    async execute(oldMessage, newMessage) {
        if (oldMessage.partial)
            await oldMessage.fetch();

        const auditChannel = newMessage.client.channels.cache.get(auditChannelId);

        try {
            if (newMessage.author.bot) return;

            const messageEmbed = new MessageEmbed()
                .setAuthor(`${newMessage.author.tag}`, `${newMessage.author.displayAvatarURL()}`)
                .setDescription(`Message edited in <#${newMessage.channelId}> [Jump to message](${newMessage.url})\n${newMessage.author} (${newMessage.author.tag})`)
                .setTimestamp()
                .setColor("RANDOM")
                .setFooter(`User ID: ${newMessage.author.id}`)

            try {
                messageEmbed
                    .addField("Old Message Content", `${oldMessage.content || "N/A"}`);
            }
             catch (e) {
            }

            try {
                messageEmbed
                    .addField("New Message Content", `${newMessage.content || "N/A"}`);
            }
            catch (e) {
            }
            try {
                messageEmbed
                    .addField("Old Message Image", `${oldMessage.attachments.first().url || "N/A"}`)
            }
            catch (e) {
            }
            try {
                messageEmbed
                    .addField("New Message Image", `${newMessage.attachments.first().url || "N/A"}`)
            }
            catch (e) {
            }

            return auditChannel.send({embeds: [messageEmbed]})
        } catch (e) {
            console.log(e)
            return auditChannel.send({content: `A message was edited, but there was a problem in retrieving data for it.`})
        }
    },
};
