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

//events
client.once("ready", () => {
  //set the status
  client.user.setActivity("with discord.js documentation", { type: "PLAYING" });
  console.log(client.user.username);
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) return;

  //retrieve the command details by using the command name as map key
  const command = client.commands.get(interaction.commandName);

  //if command not in the map then return
  if (!command) return;

  //execute the command or print error if it fails
  try {
    await command.execute(interaction);
  } catch (e) {
    console.error(e);
    await interaction.reply({
      content: "There was an error while executing this command!",
      ephemeral: true,
    });
  }
});

//start the bot with the token from the config file
client.login(token);
