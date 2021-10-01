/*
This command will reply a joke to the user
*/

var oneLinerJoke = require("one-liner-joke");
const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
  ...new SlashCommandBuilder()
    .setName("joke")
    .setDescription("Makes you laugh."),
  permission: ["SEND_MESSAGES"],
  cooldown: 5,

  /**
   *
   * @param interaction
   * @returns {Promise<void>}
   */
  async execute(interaction) {
    const getRandomJoke = oneLinerJoke.getRandomJoke();
    await interaction.reply({
      content: getRandomJoke.body,
    });
  },
};
