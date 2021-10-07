// Import classes and files

const { token } = require("./config.json");
const { Client, Collection } = require("discord.js");

const dbObjects = require("./db/dbObjects");

// Create a new discord client
const client = new Client({ intents: 32767 });

//create a collection to store all the commands
client.commands = new Collection();

//get the events handler
require("./handlers/events")(client);

//get the commands handler
require("./handlers/commands")(client);

// //https://stackoverflow.com/questions/36979146/is-a-connection-to-mongodb-automatically-closed-on-process-exit
// This will handle process.exit():
process.on("exit", () => {
  dbObjects.mongoo.connection.close().then(() => {
    console.log("MongoDb connection closed.");
    console.log("exit");
    process.exit();
  });
});

// This will handle kill commands, such as CTRL+C:
process.on("SIGINT", () => {
  dbObjects.mongoo.connection.close().then(() => {
    console.log("MongoDb connection closed.");
    console.log("SIGINT");
    process.exit();
  });
});
process.on("SIGTERM", () => {
  dbObjects.mongoo.connection.close().then(() => {
    console.log("MongoDb connection closed.");
    console.log("SIGTERM");
    process.exit();
  });
});

// This will prevent dirty exit on code-fault crashes:
process.on("uncaughtException", (err) => {
  dbObjects.mongoo.connection.close().then(() => {
    console.log("MongoDb connection closed.");
    console.log(`"uncaughtException:  ${err}`);
    process.exit();
  });
});

//start the bot with the token from the config file
client.login(token);
