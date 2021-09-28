// Import classes and files
const { Client, Intents } = require("discord.js");
const { token } = require("./config.json");

// Create a new discord client
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

//events
client.once("ready", () => {
  //set the status
  client.user.setActivity("with discord.js documentation", { type: "PLAYING" });
  console.log(client.user.username);
});

//start the bot with the token from the config file
client.login(token);
