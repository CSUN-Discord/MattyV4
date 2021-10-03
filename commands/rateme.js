/*
This command will send a rating to the user
*/

const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
  ...new SlashCommandBuilder()
    .setName("rateme")
    .setDescription("Gives you a rating."),
  permission: ["SEND_MESSAGES"],

  /**
   *
   * @param interaction
   * @returns {Promise<void>}
   */
  async execute(interaction) {
    await interaction.reply(
      `**You are a ${Math.floor(Math.random() * 11).toString()}/10**`
    );
  },
};
