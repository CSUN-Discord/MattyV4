/*
This command will create a new thread for the roommate search
*/

const {MessageEmbed} = require("discord.js");
const channelsFunctions = require("../db/functions/channelsFunctions.js");

module.exports = {
    name: "roommate",
    description: "Create a roommate listing.",
    options: [
        {
            name: "title",
            description: "Title of your listing.",
            required: true,
            type: "STRING",
        },
        {
            name: "looking_for",
            description: "Looking for roommate or a room?",
            required: true,
            type: "STRING",
            choices: [
                {
                    name: "roommate",
                    value: "Roommate",
                },
                {
                    name: "room",
                    value: "Room",
                },
            ],
        },
        {
            name: "price",
            description: "Price Range",
            required: true,
            type: "STRING",
        },
        {
            name: "details",
            description: "Details of your listing.",
            required: true,
            type: "STRING",
        },
        {
            name: "links",
            description: "Links/Pictures",
            required: false,
            type: "STRING",
        },
    ],
    permission: ["SEND_MESSAGES"],

    /**
     *
     * @param interaction
     * @returns {Promise<void>}
     */
    async execute(interaction) {
        const channelIds = await channelsFunctions.getChannelId(interaction.guild.id);
        const roommateChannelId = channelIds[0].channels.roommate || null;

        if (roommateChannelId == null)
            return;

        const roommateChannel = interaction.client.channels.cache.get(roommateChannelId);

        if (roommateChannel.type !== "GUILD_TEXT")
            return;

        if (interaction.channel.id !== roommateChannelId)
            return interaction.reply({
                content: "This command only works in the roommate channel.",
                ephemeral: true,
            });
        const title = interaction.options.getString("title");
        const lookingFor = interaction.options.getString("looking_for");
        const price = interaction.options.getString("price");
        const details = interaction.options.getString("details");
        const links = interaction.options.getString("links");

        const roomateChannel =
            interaction.client.channels.cache.get(roommateChannelId);

        const thread = await roomateChannel.threads.create({
            name: title,
            autoArchiveDuration: "MAX",
            reason: `${interaction.member}'s new listing.`,
        });

        const listingEmbed = new MessageEmbed()
            .setColor("GREEN")
            .setTitle(title)
            .setDescription(`${interaction.member}'s new listing.`)
            .addFields(
                {name: "Looking for a", value: lookingFor},
                {name: "Price Range", value: `$${price}`},
                {name: "Extra details", value: details}
            );
        if (links) listingEmbed.addField("Pictures: ", `${links}`);

        await thread.send(
            `${interaction.member}, Created a thread for: ${title}. Please use the archive-thread command when this listing is completed.`
        );
        await thread.send({embeds: [listingEmbed]});

        await interaction.reply({
            content: "Submission received.",
            ephemeral: true,
        });
    },
};
