/*
event that happens when someone adds a reaction to a message
 */

const {guildId} = require("../config.json");
const pollFunctions = require("../db/functions/pollFunctions");
const channelsFunctions = require("../db/functions/channelsFunctions.js");
module.exports = {
    name: "messageReactionAdd",
    once: false,
    /**
     *
     * @param reaction
     * @param user
     * @returns {Promise<void>}
     */
    async execute(reaction, user) {
        if (reaction.message.partial) reaction.message.fetch();
        if (reaction.partial) reaction.fetch();
        if (user.bot) return null;
        if (!reaction.message.guild) return null;

        pollFunctions.updateReactions(reaction, user, true);

        const guild = reaction.client.guilds.cache.get(guildId);

        const resident = guild.roles.cache.find(
            (r) => r.id === "491747936435306526"
        );
        const meetups = guild.roles.cache.find(
            (r) => r.id === "601273275016019978"
        );
        const minecraft = guild.roles.cache.find(
            (r) => r.id === "694775549196763177"
        );
        const koreaboo = guild.roles.cache.find(
            (r) => r.id === "755254996995538995"
        );
        const lecture = guild.roles.cache.find(
            (r) => r.id === "811796493622050826"
        );
        const templeFollower = guild.roles.cache.find(
            (r) => r.id === "859649594815807489"
        );
        const movie = guild.roles.cache.find(
            (r) => r.id === "726280155190001735"
        );

        const channelIds = await channelsFunctions.getChannelId(reaction.message.guild.id);
        const roleChangeChannelId = channelIds[0].channels.roleChange || null;

        if (roleChangeChannelId == null)
            return;

        if (reaction.message.channel.id === roleChangeChannelId) {
            if (reaction.emoji.name === `1️⃣`) {
                reaction.message.guild.members.cache
                    .get(user.id)
                    .roles.add(resident);
            } else if (reaction.emoji.name === `2️⃣`) {
                reaction.message.guild.members.cache
                    .get(user.id)
                    .roles.add(meetups);
            } else if (reaction.emoji.name === `3️⃣`) {
                reaction.message.guild.members.cache
                    .get(user.id)
                    .roles.add(minecraft);
            } else if (reaction.emoji.name === `4️⃣`) {
                reaction.message.guild.members.cache
                    .get(user.id)
                    .roles.add(koreaboo);
            } else if (reaction.emoji.name === `5️⃣`) {
                reaction.message.guild.members.cache
                    .get(user.id)
                    .roles.add(lecture);
            } else if (reaction.emoji.name === `6️⃣`) {
                reaction.message.guild.members.cache
                    .get(user.id)
                    .roles.add(templeFollower);
            } else if (reaction.emoji.name === `7️⃣`) {
                reaction.message.guild.members.cache
                    .get(user.id)
                    .roles.add(movie);
            }
        }
    },
};
