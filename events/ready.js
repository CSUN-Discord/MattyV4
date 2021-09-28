/*
This event logs when the bot starts and sets its activity
*/

module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    client.user.setActivity("with discord.js documentation", {
      type: "PLAYING",
    });
    console.log(client.user.username);
  },
};
