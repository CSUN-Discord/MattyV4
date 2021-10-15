/*
This command will allow you to start a giveaway
*/

const {MessageEmbed} = require("discord.js");
const giveawayFunctions = require("../db/functions/giveawayFunctions");
const { giveawaysChannelId, giveawaysVerifiedChannelId } = require("../validation/channels.json");


module.exports = {
    name: "giveaway",
    description: "Start a giveaway.",
    permission: ["SEND_MESSAGES"],
    options: [
        {
            name: "location",
            description: "Choose if this is a verified or normal giveaway.",
            type: "STRING",
            choices: [
                {
                    name: "verified",
                    value: "verified",
                },
                {
                    name: "normal",
                    value: "normal",
                },
            ],
            required: true,
        },
        {
            name: "description",
            description: "What is the giveaway item?",
            type: "STRING",
            required: true,
        },
        {
            name: "winners",
            description: "How many winners for this giveaway?",
            type: "NUMBER",
            required: true,
        },
        {
            name: "day",
            description: "Day this giveaway ends.",
            type: "NUMBER",
            required: true,
        },
        {
            name: "month",
            description: "Month this giveaway ends.",
            type: "NUMBER",
            required: true,
            choices: [
                {
                    name: "January",
                    value: 1,
                },
                {
                    name: "February",
                    value: 2,
                },
                {
                    name: "March",
                    value: 3,
                },
                {
                    name: "April",
                    value: 4,
                },
                {
                    name: "May",
                    value: 5,
                },
                {
                    name: "June",
                    value: 6,
                },
                {
                    name: "July",
                    value: 7,
                },
                {
                    name: "August",
                    value: 8,
                },
                {
                    name: "September",
                    value: 9,
                },
                {
                    name: "October",
                    value: 10,
                },
                {
                    name: "November",
                    value: 11,
                },
                {
                    name: "December",
                    value: 12,
                },
            ],
        },
        {
            name: "year",
            description: "Year this giveaway ends.",
            type: "NUMBER",
            required: true,
            choices: [
                {
                    name: new Date().getFullYear(),
                    value: new Date().getFullYear(),
                },
                {
                    name: new Date().getFullYear()+1,
                    value: new Date().getFullYear()+1,
                },
            ],
        },
        {
            name: "hour",
            description: "Hour this giveaway ends.",
            type: "NUMBER",
            required: true,
            choices: [
                {
                    name: "12am",
                    value: 0,
                },
                {
                    name: "1am",
                    value: 1,
                },
                {
                    name: "2am",
                    value: 2,
                },
                {
                    name: "3am",
                    value: 3,
                },
                {
                    name: "4am",
                    value: 4,
                },
                {
                    name: "5am",
                    value: 5,
                },
                {
                    name: "6am",
                    value: 6,
                },
                {
                    name: "7am",
                    value: 7,
                },
                {
                    name: "8am",
                    value: 8,
                },
                {
                    name: "9am",
                    value: 9,
                },
                {
                    name: "10am",
                    value: 10,
                },
                {
                    name: "11am",
                    value: 11,
                },
                {
                    name: "12pm",
                    value: 12,
                },
                {
                    name: "1pm",
                    value: 13,
                },
                {
                    name: "2pm",
                    value: 14,
                },
                {
                    name: "3pm",
                    value: 15,
                },
                {
                    name: "4pm",
                    value: 16,
                },
                {
                    name: "5pm",
                    value: 17,
                },
                {
                    name: "6pm",
                    value: 18,
                },
                {
                    name: "7pm",
                    value: 19,
                },
                {
                    name: "8pm",
                    value: 20,
                },
                {
                    name: "9pm",
                    value: 21,
                },
                {
                    name: "10pm",
                    value: 22,
                },
                {
                    name: "11pm",
                    value: 23,
                },
            ],
        },
        {
            name: "minute",
            description: "Minute this giveaway ends.",
            type: "NUMBER",
            choices: [
                {
                    name: "00",
                    value: 0,
                },
                {
                    name: "05",
                    value: 5,
                },
                {
                    name: "10",
                    value: 10,
                },
                {
                    name: "15",
                    value: 15,
                },
                {
                    name: "20",
                    value: 20,
                },
                {
                    name: "25",
                    value: 25,
                },
                {
                    name: "30",
                    value: 30,
                },
                {
                    name: "35",
                    value: 35,
                },
                {
                    name: "40",
                    value: 40,
                },
                {
                    name: "45",
                    value: 45,
                },
                {
                    name: "50",
                    value: 50,
                },
                {
                    name: "55",
                    value: 55,
                },
            ],
            required: true,
        },
        {
            name: "sponsor",
            description: "Who is the sponsor of this giveaway?",
            type: "USER",
            required: false,
        },
    ],

    /**
     *
     * @param interaction
     * @returns {Promise<void>}
     */
    async execute(interaction) {
        const location = interaction.options.getString("location");
        const description = interaction.options.getString("description");
        let sponsor = interaction.options.getUser("sponsor");
        const winners = interaction.options.getNumber("winners");
        const day = interaction.options.getNumber("day");
        const month = interaction.options.getNumber("month");
        const year = interaction.options.getNumber("year");
        const hour = interaction.options.getNumber("hour");
        const minute = interaction.options.getNumber("minute");

        if (sponsor == null) {
            sponsor = interaction.user;
        }


        if (winners < 1)
            return interaction.reply({
                content: "Incorrect number of winners.",
                ephemeral: true,
            });

        if (day > 31 || day < 1)
            return interaction.reply({
                content: "Incorrect day.",
                ephemeral: true,
            });

        if (year === new Date().getFullYear()) {
            if (month < new Date().getMonth()+1) {
                return interaction.reply({
                    content: "Incorrect month.",
                    ephemeral: true,
                });
            }
            if (month === new Date().getMonth()+1) {
                if (day < new Date().getDate()) {
                    return interaction.reply({
                        content: "Incorrect day.",
                        ephemeral: true,
                    });
                }
            }
        }

        let timeFormat = "";
        let minuteFormat = "";
        if (minute < 10) {
            minuteFormat = `0${minute}`
        }
        else {
            minuteFormat = `${minute}`
        }
        if (hour > 12) {
            timeFormat = `${hour-12}:${minuteFormat}pm`
        }
        else {
            timeFormat = `${hour}:${minuteFormat}am`
        }

        const giveawayEmbed = new MessageEmbed()
            .setTitle("Giveaway Time!")
            .setDescription(`${description}\n\n**Ending: ${month}/${day}/${year} ${timeFormat}**`)
            .setAuthor(`Sponsor: ${sponsor.tag}`)
            .setFooter(`# of Winners: ${winners}`)
            .setTimestamp()

        const msg = await interaction.reply({embeds : [giveawayEmbed], fetchReply: true});
        await msg.react(`🎉`)

        const time = [year, month-1, day, hour, minute]

        // const giveawayChannel = client.channels.cache.get("468170551135961108")

        if (location === "verified") {
            await giveawayFunctions.addGiveaway(msg.id, winners, time, giveawaysVerifiedChannelId, description, sponsor.id);
            // await giveawayFunctions.addGiveaway(msg.id, winners, time, giveawayChannel, description, sponsor.id);
            await giveawayFunctions.startSchedule(msg.id, winners, time, giveawaysVerifiedChannelId, description, sponsor.id);
            // await giveawayFunctions.startSchedule(msg.id, winners, time, giveawayChannel, description, sponsor.id);
        }
        else {
            await giveawayFunctions.addGiveaway(msg.id, winners, time, giveawaysChannelId, description, sponsor.id);
            // await giveawayFunctions.addGiveaway(msg.id, winners, time, giveawayChannel, description, sponsor.id);
            await giveawayFunctions.startSchedule(msg.id, winners, time, giveawaysChannelId, description, sponsor.id);
            // await giveawayFunctions.startSchedule(msg.id, winners, time, giveawayChannel, description, sponsor.id);
        }
    },
};
