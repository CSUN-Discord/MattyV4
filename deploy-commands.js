/*
run node deploy-commands.js to register commands for the bot

use this is your registering guild commands,
.put(Routes.applicationGuildCommands(clientId, guildId), {
    body: commands,
  })

 use this is your registering global commands,
.put(Routes.applicationCommands(clientId), {
    body: commands,
  })

 */

const fs = require("fs");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { clientId, guildId, token } = require("./config.json");

const commands = [];
const commandFiles = fs
  .readdirSync("./commands")
  .filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  commands.push(command.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(token);

rest
  .put(Routes.applicationGuildCommands(clientId, guildId), {
    body: commands,
  })
  .then(() => console.log("Successfully registered application commands."))
  .catch(console.error);
