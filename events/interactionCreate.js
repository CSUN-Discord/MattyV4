/*
event that listens for commands and runs the command
 */

module.exports = {
  name: "interactionCreate",
  async execute(interaction) {
    if (!interaction.isCommand()) return;

    //retrieve the command details by using the command name as map key
    const command = interaction.client.commands.get(interaction.commandName);

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
  },
};
