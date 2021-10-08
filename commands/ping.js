/*
This command sends a simple message to check if the bot is active
*/

const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
  ...new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Use to check if bot is active"),
  permission: ["SEND_MESSAGES"],

  /**
   *
   * @param interaction
   * @returns {Promise<void>}
   */
  async execute(interaction) {
    await interaction.reply({
      content: `Websocket heartbeat: ${interaction.client.ws.ping}ms.`,
      ephemeral: true,
    });
  },
};
