// Import classes and files

const { token } = require("./config.json");
const { Client, Collection } = require("discord.js");

const Chat = require("easy-discord-chatbot");
const chat = new Chat({ name: "Matty" });

const dbObjects = require("./db/dbObjects");

// Create a new discord client
const client = new Client({ intents: 32767 });

//create a collection to store all the commands
client.commands = new Collection();

//get the events handler
require("./handlers/events")(client);

//get the commands handler
require("./handlers/commands")(client);

client.on("messageCreate", async (message) => {
  if (message.channel.id === "894103257335603270" && !message.author.bot) {
    let reply = await chat.chat(message.content);
    await message.reply(reply);
  }

  // if (message.channel.id === "523967992917393418" && !message.author.bot) {
  //   message.delete();
  // }
});

// //https://stackoverflow.com/questions/36979146/is-a-connection-to-mongodb-automatically-closed-on-process-exit
// This will handle process.exit():
process.on("exit", () => {
  dbObjects.mongoo.connection.close().then(() => {
    console.log("MongoDb connection closed.");
    process.exit();
  });
});

// This will handle kill commands, such as CTRL+C:
process.on("SIGINT", () => {
  dbObjects.mongoo.connection.close().then(() => {
    console.log("MongoDb connection closed.");
    process.exit();
  });
});
process.on("SIGTERM", () => {
  dbObjects.mongoo.connection.close().then(() => {
    console.log("MongoDb connection closed.");
    process.exit();
  });
});

// This will prevent dirty exit on code-fault crashes:
process.on("uncaughtException", () => {
  dbObjects.mongoo.connection.close().then(() => {
    console.log("MongoDb connection closed.");
    process.exit();
  });
});

//start the bot with the token from the config file
client.login(token);
