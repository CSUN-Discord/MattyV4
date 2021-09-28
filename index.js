// Import classes and files
const { token } = require("./config.json");
const fs = require("fs");
const { Client, Collection, Intents } = require("discord.js");

// Create a new discord client
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

//create a collection to store all the commands
client.commands = new Collection();

//read all the js names in the /commands folder and insert them into an array
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

//go through the array of file names and insert them into the collection with the command name as the key
for (const file of commandFiles) {
  const command = require(`./commands/${file}`);

  //search for the file using the command name as a key which is received by the user
  client.commands.set(command.data.name, command);
}

//read all the js names in the /events folder and insert them into an array
const eventFiles = fs
  .readdirSync("./events")
  .filter((file) => file.endsWith(".js"));

//run the event once or have it on depending on the once property of the event
for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

//start the bot with the token from the config file
client.login(token);
