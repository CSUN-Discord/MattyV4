/*
event that happens when someone adds a reaction to a message
 */

const {roleChangeChannelId} = require("../validation/channels.json");
const {guildId} = require("../config.json");
module.exports = {
    name: "messageReactionAdd",
    once: true,
    /**
     *
     * @param reaction
     * @param user
     * @returns {Promise<void>}
     */
    async execute(reaction, user) {
        if (reaction.message.partial) await reaction.message.fetch();
        if (reaction.partial) await reaction.fetch();
        if (user.bot) return;
        if (!reaction.message.guild) return;

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

        if (reaction.message.channel.id === roleChangeChannelId) {
            if (reaction.emoji.name === `1️⃣`) {
                await reaction.message.guild.members.cache
                    .get(user.id)
                    .roles.add(resident);
            } else if (reaction.emoji.name === `2️⃣`) {
                await reaction.message.guild.members.cache
                    .get(user.id)
                    .roles.add(meetups);
            } else if (reaction.emoji.name === `3️⃣`) {
                await reaction.message.guild.members.cache
                    .get(user.id)
                    .roles.add(minecraft);
            } else if (reaction.emoji.name === `4️⃣`) {
                await reaction.message.guild.members.cache
                    .get(user.id)
                    .roles.add(koreaboo);
            } else if (reaction.emoji.name === `5️⃣`) {
                await reaction.message.guild.members.cache
                    .get(user.id)
                    .roles.add(lecture);
            } else if (reaction.emoji.name === `6️⃣`) {
                await reaction.message.guild.members.cache
                    .get(user.id)
                    .roles.add(templeFollower);
            } else if (reaction.emoji.name === `7️⃣`) {
                await reaction.message.guild.members.cache
                    .get(user.id)
                    .roles.add(movie);
            }
        }
    },
};
