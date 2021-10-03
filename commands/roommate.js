/*
This command will create a new thread depending on the item being sold
*/

const { MessageEmbed } = require("discord.js");

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
  cooldown: 5,

  /**
   *
   * @param interaction
   * @returns {Promise<void>}
   */
  async execute(interaction) {
    const title = interaction.options.getString("title");
    const lookingFor = interaction.options.getString("looking_for");
    const price = interaction.options.getString("price");
    const details = interaction.options.getString("details");
    const links = interaction.options.getString("links");

    const marketPlaceChannel =
      interaction.client.channels.cache.get("570809696135544835");

    const thread = await marketPlaceChannel.threads.create({
      name: title,
      autoArchiveDuration: "MAX",
      reason: `${interaction.member}'s new listing.`,
    });

    const listingEmbed = new MessageEmbed()
      .setColor("GREEN")
      .setTitle(title)
      .setDescription(`${interaction.member}'s new listing.`)
      .addFields(
        { name: "Looking for a", value: lookingFor },
        { name: "Price Range", value: `$${price}` },
        { name: "Extra details", value: details }
      );
    if (links) listingEmbed.addField("Pictures: ", `${links}`);

    await thread.setLocked(true);
    await thread.send(`${interaction.member}, Created a thread for: ${title}`);
    await thread.send({ embeds: [listingEmbed] });

    await interaction.reply("Submission received.");
  },
};
