/*
This command will flip a coin
*/

const { MessageAttachment } = require("discord.js");
const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
  ...new SlashCommandBuilder()
    .setName("coinflip")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Number of coins to flip. [1-20]")
        .setRequired(false)
    )
    .setDescription("Gives you a coin flip."),
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
      if (Math.random() < 0.5) {
        await interaction.reply("heads");
      } else {
        await interaction.reply("tails");
      }
      integer--;
      count++;
      while (integer > 0 && count < 20) {
        if (Math.random() < 0.5) {
          await interaction.followUp("heads");
        } else {
          await interaction.followUp("tails");
        }
        integer--;
        count++;
      }
    } else if (integer === null) {
      const coin = Math.floor(Math.random() * 2) == 0;
      if (coin) {
        const attachment = new MessageAttachment(
          `https://c.tenor.com/nEu74vu_sT4AAAAC/heads-coinflip.gif`
        );
        await interaction.reply({
          content: "\u200b",
          files: [attachment],
        });
      } else {
        const attachment = new MessageAttachment(
          `https://c.tenor.com/aEhU9bOB_3YAAAAC/tail.gif`
        );
        await interaction.reply({
          content: "\u200b",
          files: [attachment],
        });
      }
    }
  },
};
