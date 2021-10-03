/*
This command will create a new thread depending on the item being sold
*/

const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "marketplace",
  description: "Create a listing to sell an item.",
  options: [
    {
      name: "title",
      description: "Title of your listing.",
      required: true,
      type: "STRING",
    },
    {
      name: "description",
      description: "Description of your listing.",
      required: true,
      type: "STRING",
    },
    {
      name: "price",
      description: "Price of your listing.",
      required: true,
      type: "NUMBER",
    },
    {
      name: "condition",
      description: "Condition of your listing.",
      required: true,
      type: "STRING",
      choices: [
        {
          name: "new",
          value: "New",
        },
        {
          name: "very_good",
          value: "Very Good",
        },
        {
          name: "good",
          value: "Good",
        },
        {
          name: "acceptable",
          value: "Acceptable",
        },
        {
          name: "digital",
          value: "Digital",
        },
      ],
    },
    {
      name: "picture_link",
      description: "Imgur link for pictures.",
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
    const description = interaction.options.getString("description");
    const price = interaction.options.getNumber("price");
    const condition = interaction.options.getString("condition");
    const pictureLink = interaction.options.getString("picture_link");

    const marketPlaceChannel =
      interaction.client.channels.cache.get("523967992917393418");

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
        { name: "Description", value: description },
        { name: "Price", value: `$${price}` },
        { name: "Condition", value: condition }
      );
    if (pictureLink) listingEmbed.addField("Pictures: ", `${pictureLink}`);

    await thread.setLocked(true);
    await thread.send(
      `${interaction.member}, Created a thread for: ${title}. Please use the deletethread command when this listing is completed.`
    );
    await thread.send({ embeds: [listingEmbed] });

    await interaction.reply("Submission received.");
  },
};
