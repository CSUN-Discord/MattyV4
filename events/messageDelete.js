/*
event that happens when someone deletes a message
 */

const pollFunctions = require("../db/functions/pollFunctions");
const {MessageEmbed} = require("discord.js");
const {auditChannelId} = require("../validation/channels.json");

module.exports = {
    name: "messageDelete",
    once: false,

    /**
     *
     * @param message
     */
    async execute(message) {
        console.log(message)
        if (!message.guild) return;
        pollFunctions.deletePoll(message);

        const fetchedLogs = await message.guild.fetchAuditLogs({
            limit: 1,
            type: 'MESSAGE_DELETE',
        });

        const auditChannel = message.client.channels.cache.get(auditChannelId);
        const deletionLog = fetchedLogs.entries.first();

        const messageDeletionEmbed = new MessageEmbed()
            .setColor("RANDOM")
            .setTimestamp()

        try {
            messageDeletionEmbed
                .setAuthor(`${message.author.tag}`, `${message.author.displayAvatarURL()}`)
                .setFooter(`Author: ${message.author.id} | Message ID: ${message.id}`)
        } catch (e) {
            try {
                messageDeletionEmbed
                    .setFooter(`Message ID: ${message.id}`)
            } catch (e) {
            }
        }

        try {
            messageDeletionEmbed
                .addField("Content:", `${message.content}`)
        } catch (e) {
            messageDeletionEmbed
                .addField("Content:", `N/A`)
        }
        try {
            messageDeletionEmbed
                .addField("Image:", `${message.attachments.first().url}`)
                .setImage(`${message.attachments.first().attachment}`)
        } catch (e) {
            messageDeletionEmbed
                .addField("Image:", `N/A`)
        }

        try {
            if (deletionLog.target.id === message.author.id) {
                try {
                    messageDeletionEmbed
                        .setDescription(`Message sent by ${message.author} deleted in <#${message.channelId}> by ${deletionLog.executor} (${deletionLog.executor.tag}).`)
                        .addField("Content:", `${message.content}`)
                    return auditChannel.send({embeds : [messageDeletionEmbed]})
                }catch (e) {
                    try {
                        messageDeletionEmbed
                            .setDescription(`Message sent by ${deletionLog.target.author} deleted in <#${message.channelId}> by ${deletionLog.executor} (${deletionLog.executor.tag}).`)
                        return auditChannel.send({embeds : [messageDeletionEmbed]})
                    } catch (e) {
                        return auditChannel.send({content: `Message sent by ${deletionLog.target.author} was deleted in <#${message.channelId}> by ${deletionLog.executor} (${deletionLog.executor.tag}).`})
                    }
                }
            } else {
                try {
                    messageDeletionEmbed
                        .setDescription(`Message sent by ${message.author} deleted in <#${message.channelId}>, but we don't know by who (Possibly by a bot or themselves).`)
                    return auditChannel.send({embeds : [messageDeletionEmbed]})
                } catch (e) {
                    try {
                        messageDeletionEmbed
                            .setDescription(`Message sent by ${deletionLog.target.author} deleted in <#${message.channelId}>, but we don't know by who (Possibly by a bot or themselves).`)
                        return auditChannel.send({embeds : [messageDeletionEmbed]})
                    } catch (e) {
                        return auditChannel.send({content: `Message sent by ${deletionLog.target.author} was deleted in <#${message.channelId}>, but we don't know by who.`})
                    }
                }
            }
        } catch (e) {
            console.log(e)
            return auditChannel.send({content: `A message was deleted, but there was problems in retrieving it.`})
        }
    },
};
