/*
This command will send a list of all maps if there isn't an argument
If there is an argument it will send the desired map picture

*/

const { MessageSelectMenu, MessageActionRow } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
  ...new SlashCommandBuilder()
    .setName("maps")
    .setDescription("Sends you various school maps."),
  permission: ["SEND_MESSAGES"],
  cooldown: 5,

  /**
   *
   * @param interaction
   * @returns {Promise<void>}
   */
  async execute(interaction) {
    const row = new MessageActionRow().addComponents(
      new MessageSelectMenu()
        .setPlaceholder("Select Map Picture")
        .setCustomId("mapSelect")
        .addOptions([
          {
            label: "campus",
            description: "The campus map",
            value: "optionOne",
          },
          {
            label: "housing",
            description: "The housing map",
            value: "optionTwo",
          },
          {
            label: "shuttle",
            description: "The shuttle map",
            value: "optionThree",
          },
          {
            label: "water",
            description: "The water map",
            value: "optionFour",
          },
          {
            label: "lactation",
            description: "The lactation map",
            value: "optionFive",
          },
        ])
    );

    await interaction.reply({
      content: "Select a map",
      components: [row],
      ephemeral: true,
    });

    const collector = interaction.channel.createMessageComponentCollector({
      componentType: "SELECT_MENU",
    });
    collector.on("collect", async (collected) => {
      const value = collected.values[0];

      switch (value) {
        case "campus":
          //post picture
          break;
        case "housing":
          //post picture
          break;
        case "shuttle":
          //post picture
          break;
        case "water":
          //post picture
          break;
        case "lactation":
          //post picture
          break;
      }
    });
  },
};
