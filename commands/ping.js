/*
This command sends a simple message to check if the bot is active
*/

const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Use to check if bot is active."),
  async execute(interaction) {
    await interaction.reply("Pong!");
  },
};
