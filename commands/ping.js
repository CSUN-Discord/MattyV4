/*
This command sends a simple message to check if the bot is active
*/

module.exports = {
  name: "ping",
  description: "Use to check if bot is active.",
  permission: ["SEND_MESSAGES"],
  cooldown: 3,

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
