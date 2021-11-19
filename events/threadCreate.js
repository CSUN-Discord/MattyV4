/*
event that happens whenever a thread is created or when the client user is added to a thread
 */

const {MessageEmbed} = require("discord.js");
const channelsFunctions = require("../db/functions/channelsFunctions.js");

module.exports = {
    name: "threadCreate",
    once: false,

    /**
     *
     * @param thread
     * @returns {Promise<void>}
     */

    async execute(thread) {
        await thread.setLocked(true);

        const channelIds = await channelsFunctions.getChannelId(thread.guild.id);
        const auditChannelId = channelIds[0].channels.audit || null;

        if (auditChannelId == null)
            return;

        const auditChannel = thread.client.channels.cache.get(auditChannelId);

        if (auditChannel.type !== "GUILD_TEXT")
            return;

        try {
            const user = await thread.client.users.fetch(thread.ownerId);

            const threadCreatEmbed = new MessageEmbed()
                .setColor("RANDOM")
                .setAuthor(`${thread.guild.name}`, `${thread.guild.iconURL()}`)
                .setDescription(`Thread called ${thread.name} created in <#${thread.parentId}> by ${user} (${user.tag}).`)
                .setFooter(`Creator: ${thread.ownerId} | Thread Id: ${thread.id}`)
                .setTimestamp()

            return auditChannel.send({embeds: [threadCreatEmbed]})
        } catch (e) {
            console.log(e)
            return auditChannel.send({content: `A thread was created, but there was a problem in retrieving data for it.`})
        }
    },
};
