/*
This command sends a simple message to check if the bot is active
*/

const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
  // name: "ping",
  // description: "Use to check if bot is active.",
  permission: ["SEND_MESSAGES"],
  ...new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Use to check if bot is active"),
  cooldown: 5,

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
