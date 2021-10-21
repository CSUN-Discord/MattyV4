/*
mass message user who have a certain string in their name
*/

const { guildId } = require("../config.json");

module.exports = {
    name: "mass-message",
    description: "Message users with a certain string in their name.",
    permission: ["ADMINISTRATOR"],
    options: [
        {
            name: "filter",
            description: "Find usernames with this string.",
            required: true,
            type: "STRING"
        },
        {
            name: "message",
            description: "Message to send..",
            required: true,
            type: "STRING"
        }
    ],

    /**
     *
     * @param interaction
     * @returns {Promise<void>}
     */
    async execute(interaction) {

        const filter = interaction.options.getString("filter").toLowerCase();
        const message = interaction.options.getString("message");

        const guild = interaction.client.guilds.cache.get(guildId);

        let stringUsers = "";

        guild.members.cache.forEach((member) => {
            if (member.nickname != null) {
                if (member.nickname.toLowerCase().includes(filter))
                    stringUsers += ` ${member.user}`;
            }
            else {
                if (member.user.username.toLowerCase().includes(filter))
                    stringUsers += ` ${member.user}`;
            }
        })

        if (stringUsers.length < 1)
            stringUsers = "No users to ping."
        else
            stringUsers += `, ${message}`;
        interaction.reply(stringUsers);
    },
};