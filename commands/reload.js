/*
This command restarts the bot if using PM2 or end the node process regularly
 */

module.exports = {
  name: "reload",
  description: "Restarts the bot.",
  permission: ["ADMINISTRATOR"],

  /**
   *
   * @param interaction
   * @returns {Promise<void>}
   */
  async execute(interaction) {
    await interaction.reply("Bot is reloading.");
    process.exit();
  },
};
