/*
This command will give out the initial roles and ping a mod/helper
*/
const Discord = require("discord.js");
const {MessageActionRow, MessageEmbed, MessageButton} = require("discord.js");
module.exports = {
    name: "answer-the-bot",
    description: "Answer the bot to get access to all channels.",
    permission: ["SEND_MESSAGES"],
    options: [
        {
            name: "major",
            description: "What is your Major?",
            type: "STRING",
            required: true,
        },
        {
            name: "year",
            description: "Choose your school year.",
            type: "STRING",
            choices: [
                {
                    name: "freshman",
                    value: "Freshman",
                },
                {
                    name: "sophomore",
                    value: "Sophomore",
                },
                {
                    name: "junior",
                    value: "Junior",
                },
                {
                    name: "senior",
                    value: "Senior",
                },
                {
                    name: "alumni",
                    value: "Alumni",
                },
                {
                    name: "masters",
                    value: "Masters",
                },
            ],
            required: true,
        },
        {
            name: "housing",
            description: "What is your housing situation.",
            type: "STRING",
            choices: [
                {
                    name: "housing resident",
                    value: "Resident",
                },
                {
                    name: "commute",
                    value: "commute",
                },
            ],
            required: true,
        },
    ],

    /**
     *
     * @param interaction
     * @returns {Promise<void>}
     */
    async execute(interaction) {
        let major = interaction.options.getString("major");
        major = major.charAt(0).toUpperCase() + major.slice(1);

        if (major.toLowerCase() === "comp sci" || major.toLowerCase() === "compsci" || major.toLowerCase() === "cs" || major.toLowerCase() === "computerscience" || major.toLowerCase() === "computer science") {
            major = "CS"
        }

        const year = interaction.options.getString("year");
        const housing = interaction.options.getString("housing");

        //check if they have answer the bot role
        if (
            interaction.member.roles.cache.some(
                (role) => role.name === "AnswerTheBot"
            )
        ) {
            const answerEmbed = new Discord.MessageEmbed()
                .setTitle(`Is this information correct?`)
                .addFields(
                    {name: "Major", value: major},
                    {name: "Year", value: year},
                    {name: "Housing Situation:", value: housing}
                )
                .setColor("DARK_BUT_NOT_BLACK");

            const yes = new Discord.MessageButton()
                .setLabel("yes")
                .setStyle("SUCCESS")
                .setEmoji("✔")
                .setCustomId("yes");

            const no = new Discord.MessageButton()
                .setLabel("no")
                .setStyle("DANGER")
                .setEmoji("✖")
                .setCustomId("no");

            const buttonRow = new MessageActionRow();
            buttonRow.addComponents(yes);
            buttonRow.addComponents(no);

            interaction.reply({
                embeds: [answerEmbed],
                components: [buttonRow],
                ephemeral: true,
            });

            const filter = (i) => i.user == interaction.user.id;
            await interaction.channel
                .awaitMessageComponent({
                    filter: filter,
                    time: 300000,
                    componentType: "BUTTON",
                })
                .then(async (input) => {
                    if (input.customId === "yes") {
                        const requestEmbed = new MessageEmbed()
                            .setTitle("For Mod Team:")
                            .setDescription(`${input.user} requests access to the server.`)
                            .addFields(
                                {
                                    name: "Old nickname: ",
                                    value: input.user.username,
                                    inline: true,
                                },
                                {name: "Major", value: major, inline: true},
                                {
                                    name: "New nickname: ",
                                    value: `${input.user.username} - ${major}`,
                                    inline: true,
                                },
                                {name: "Year", value: year, inline: false},
                                {name: "Housing Situation:", value: housing}
                            );

                        const button = new MessageActionRow().addComponents(
                            new MessageButton()
                                .setLabel("addUser")
                                .setStyle("SUCCESS")
                                .setEmoji("✔")
                                .setCustomId("addUser")
                        );

                        await input.reply({
                            content: `${interaction.user}, please wait while someone from the mod team lets you in.`,
                            embeds: [requestEmbed],
                            components: [button],
                        });

                        const addFilter = (user) =>
                            user.member.roles.cache.some((role) => role.name === "Mod") ||
                            user.member.roles.cache.some((role) => role.name === "Admin") ||
                            user.member.roles.cache.some((role) => role.name === "Helpers");

                        setTimeout(function () {
                            input.editReply({
                                components: [],
                            });
                        }, 841000);

                        await input.channel
                            .awaitMessageComponent({
                                filter: addFilter,
                                time: 840000,
                                componentType: "BUTTON",
                            })
                            .then((inp) => {
                                try {
                                    requestEmbed.setDescription(
                                        `${input.user} has been added to the server.`
                                    );
                                    input.editReply({
                                        content: `User has been added.`,
                                        embeds: [requestEmbed],
                                        components: [],
                                    });
                                    if (inp.customId === "addUser") {

                                        input.member.roles.add(
                                            input.guild.roles.cache.find(
                                                (role) => role.name === "Student"
                                            )
                                        );
                                        input.member.roles.add(
                                            input.guild.roles.cache.find((role) => role.name === year)
                                        );
                                        input.member.roles.remove(
                                            input.guild.roles.cache.find(
                                                (role) => role.name === "AnswerTheBot"
                                            )
                                        );

                                        if (housing === "Resident")
                                            input.member.roles.add(
                                                input.guild.roles.cache.find(
                                                    (role) => role.name === housing
                                                )
                                            );
                                        if ((`${input.user.username} - ${major}`).length > 32)
                                            inp.reply({
                                                content: "User updated except for name it was too long. MANUALLY FIX IT!",
                                                ephemeral: true,
                                            });
                                        else {
                                            input.member.setNickname(
                                                `${input.user.username} - ${major}`
                                            );
                                            inp.reply({
                                                content: "User updated.",
                                                ephemeral: true,
                                            });
                                        }
                                    }
                                } catch (e) {
                                    console.log(e);
                                    inp.reply({
                                        content: "There was an error with the request.",
                                        ephemeral: true,
                                    });
                                }
                            });
                    } else if (input.customId === "no") {
                        await input.reply({
                            content: "Please make another request using **/answer-the-bot**.",
                            ephemeral: true,
                        });
                    } else {
                        await input.reply({
                            content: "Please make another request using **/answer-the-bot**.",
                            ephemeral: true,
                        });
                    }
                })
                .catch(() => {
                    // do nothing
                });
        } else {
            interaction.reply({
                content: "You need the AnswerTheBot role for this command.",
                ephemeral: true,
            });
        }
    },
};
