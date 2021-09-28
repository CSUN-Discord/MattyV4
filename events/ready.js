module.exports = {
  name: "ready",
  once: true,
  execute(client) {
    client.user.setActivity("with discord.js documentation", {
      type: "PLAYING",
    });
    console.log(`Ready! Logged in as ${client.user.tag}`);
  },
};
