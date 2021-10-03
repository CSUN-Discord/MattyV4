/*
event that listens for commands and runs the command
 */

module.exports = {
  name: "interactionCreate",

  /**
   *
   * @param interaction
   * @returns {Promise<void>}
   */
  async execute(interaction) {
    if (!interaction.isCommand()) return;

    //retrieve the command details by using the command name as map key
    const command = interaction.client.commands.get(interaction.commandName);

    //if command not in the map then return
    if (!command) return;

    // //check and update the cooldown
    // const now = Date.now();
    //
    // if (!cooldown.get(interaction.commandName)) {
    //   cooldown.set(interaction.commandName, new Map());
    //   cooldown.get(interaction.commandName).set(interaction.member, -10000);
    // }
    // if (!cooldown.get(interaction.commandName).get(interaction.member)) {
    //   cooldown.get(interaction.commandName).set(interaction.member, -10000);
    // }
    // const lastUsed = cooldown
    //   .get(interaction.commandName)
    //   .get(interaction.member);
    //
    // if (now - lastUsed > command.cooldown * 1000) {
    //   cooldown.get(interaction.commandName).set(interaction.member, now);
    //   //execute the command or print error if it fails
    try {
      await command.execute(interaction);
    } catch (e) {
      console.error(e);
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
    // }
    // else
    //   await interaction.reply({
    //     content: `Please wait ${msToTime(now - lastUsed)}.`,
    //     ephemeral: true,
    //   });
  },
};

/**
 *
 * @param ms
 * @returns {string}
 */
// function msToTime(ms) {
//   let seconds = (ms / 1000).toFixed(1);
//   let minutes = (ms / (1000 * 60)).toFixed(1);
//   let hours = (ms / (1000 * 60 * 60)).toFixed(1);
//   let days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
//   if (seconds < 60) return seconds + " Sec";
//   else if (minutes < 60) return minutes + " Min";
//   else if (hours < 24) return hours + " Hrs";
//   else return days + " Days";
// }
