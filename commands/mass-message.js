/*
mass message user who have a certain string in their name
*/

const { guildId } = require("../config.json");
const {Util} = require("discord.js");

module.exports = {
    name: "mass-message",
    description: "Message users with a certain string in their name.",
    permission: ["ADMINISTRATOR"],
    options: [
        {
            name: "filter1",
            description: "Find usernames with this string.",
            required: true,
            type: "STRING"
        },
        {
            name: "message",
            description: "Message to send.",
            required: true,
            type: "STRING"
        },
        {
            name: "filter2",
            description: "Find usernames with this string.",
            required: false,
            type: "STRING"
        },
        {
            name: "filter3",
            description: "Find usernames with this string.",
            required: false,
            type: "STRING"
        },
        {
            name: "filter4",
            description: "Find usernames with this string.",
            required: false,
            type: "STRING"
        },
        {
            name: "filter5",
            description: "Find usernames with this string.",
            required: false,
            type: "STRING"
        },
    ],

    /**
     *
     * @param interaction
     * @returns {Promise<void>}
     */
    async execute(interaction) {
        interaction.deferReply();

        const filter1 = interaction.options.getString("filter1");
        const filter2 = interaction.options.getString("filter2");
        const filter3 = interaction.options.getString("filter3");
        const filter4 = interaction.options.getString("filter4");
        const filter5 = interaction.options.getString("filter5");
        const message = interaction.options.getString("message");

        const filters = [filter1, filter2, filter3, filter4, filter5]
        const guild = interaction.client.guilds.cache.get(guildId);

        let stringUsers = "";

        guild.members.cache.forEach((member) => {
            if (member.nickname != null) {
                for (let i = 0; i < filters.length; i++) {
                    if (filters[i] != null) {
                        if ( member.nickname.toLowerCase().includes(filters[i].toLowerCase()))
                            stringUsers += ` ${member.user}`;
                    }
                }
            }
            else {
                for (let i = 0; i < filters.length; i++) {
                    if (filters[i] != null) {
                        if ( member.user.username.toLowerCase().includes(filters[i].toLowerCase()))
                            stringUsers += ` ${member.user}`;
                    }
                }
            }
        })

        if (stringUsers.length < 1)
            stringUsers = "No users to ping."
        else
            stringUsers += `, ${interaction.user.tag} needs your attention.\n`;

        const [first, ...rest] = Util.splitMessage(stringUsers, { char: " ",});

        interaction.followUp(first).then((r) => {
            // Max characters were reached so send the rest of the lyrics
            if (rest.length) {
                for (const text of rest) {
                    // send the rest of the lyrics
                    interaction.followUp({
                        content: text
                    });
                }
            }

            interaction.followUp({content: `\n${message}`})
        });
    },
};