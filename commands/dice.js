/*
This command will roll a dice

*/
const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
  ...new SlashCommandBuilder()
    .setName("dice")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Number of dice to roll. [1-20]")
        .setRequired(false)
    )
    .setDescription("Gives you a dice roll."),
  permission: ["SEND_MESSAGES"],

  /**
   *
   * @param interaction
   * @returns {Promise<void>}
   */
  async execute(interaction) {
    let integer = interaction.options.getInteger("amount");
    let count = 0;
    if (integer > 0) {
      await interaction.reply((Math.floor(Math.random() * 6) + 1).toString());
      integer--;
      count++;
      while (integer > 0 && count < 20) {
        await interaction.followUp(
          (Math.floor(Math.random() * 6) + 1).toString()
        );
        integer--;
        count++;
      }
    } else if (integer === null) {
      await interaction.reply((Math.floor(Math.random() * 6) + 1).toString());
    }
  },
};
