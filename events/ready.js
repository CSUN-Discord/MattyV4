/*
event that happens on start up to display activity
 */

module.exports = {
  name: "ready",
  once: true,
  /**
   * @param {Client} client
   */
  execute(client) {
    client.user.setActivity("with discord.js documentation", {
      type: "PLAYING",
    });
    console.log(`Ready! Logged in as ${client.user.tag}`);
  },
};
