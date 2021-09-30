// Import classes and files

const { token } = require("./config.json");
const { Client, Collection } = require("discord.js");

// Create a new discord client
const client = new Client({ intents: 32767 });

//create a collection to store all the commands
client.commands = new Collection();

//get the events handler
require("./handlers/events")(client);

//get the commands handler
require("./handlers/commands")(client);

//start the bot with the token from the config file
client.login(token);
