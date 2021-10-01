/*
command handler to read commands for a single server and set the permissions
 */

const { perms } = require("../validation/permissions");
const { promisify } = require("util");
const { glob } = require("glob");
const PG = promisify(glob);
const Ascii = require("ascii-table");
const { guildId } = require("../config.json");

/**
 * @param client
 * @returns {Promise<void>}
 */
module.exports = async (client) => {
  const table = new Ascii("Commands Loaded");

  const commandsArray = [];

  (await PG(`${process.cwd()}/commands/*.js`)).map(async (file) => {
    const command = require(file);
    if (!command.name)
      return table.addRow(file.split("/"[7]), `⚠ Failed`, "Missing a name.");
    if (!command.description)
      return table.addRow(command.name, `⚠ Failed`, "Missing a description.");
    if (!command.cooldown)
      return table.addRow(command.name, `⚠ Failed`, "Missing cooldown.");
    if (command.permissions) {
      if (perms.includes(command.permission)) command.defaultPermission = false;
      else
        return table.addRow(command.name, `⚠ Failed`, "Permission is invalid.");
    }

    client.commands.set(command.name, command);
    commandsArray.push(command);

    await table.addRow(command.name, "✔ Successful");
  });

  console.log(table.toString());

  //Permissions Check

  client.on("ready", async () => {
    const MainGuild = await client.guilds.cache.get(guildId);

    MainGuild.commands.set(commandsArray).then(async (command) => {
      const Roles = (commandName) => {
        const cmdPerms = commandsArray.find(
          (c) => c.name === commandName
        ).permissions;
        if (!cmdPerms) return null;

        return MainGuild.roles.cache.filter((r) => r.permissions.has(cmdPerms));
      };

      const fullPermissions = command.reduce((accumulator, r) => {
        const roles = Roles(r.name);
        if (!roles) return accumulator;

        const permissions = roles.reduce((a, r) => {
          return [...a, { id: r.id, type: "ROLE", permissions: true }];
        }, []);
        return [...accumulator, { id: r.id, permissions }];
      }, []);

      await MainGuild.commands.permissions.set({ fullPermissions });
    });
  });
};
