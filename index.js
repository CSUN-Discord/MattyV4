// Import classes and files

const { token } = require("./config.json");
const { Client, Collection } = require("discord.js");

const Chat = require("easy-discord-chatbot");
const chat = new Chat({ name: "Matty" });

// Create a new discord client
const client = new Client({ intents: 32767 });

//create a collection to store all the commands
client.commands = new Collection();

//get the events handler
require("./handlers/events")(client);

//get the commands handler
require("./handlers/commands")(client);

client.on("message", async (message) => {
  if (message.channel.id === "894103257335603270" && !message.author.bot) {
    let reply = await chat.chat(message.content);
    message.reply(reply);
  }
});

//start the bot with the token from the config file
client.login(token);
