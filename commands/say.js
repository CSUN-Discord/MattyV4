/*
This command will repeat what the user said
*/

const { SlashCommandBuilder } = require("@discordjs/builders");
module.exports = {
  ...new SlashCommandBuilder()
    .setName("say")
    .addStringOption((option) =>
      option
        .setName("say")
        .setDescription("Whatever you want repeated.")
        .setRequired(true)
    )
    .setDescription("Repeats after you."),

  permission: ["SEND_MESSAGES"],
  cooldown: 5,

  /**
   *
   * @param interaction
   * @returns {Promise<void>}
   */
  async execute(interaction) {
    const string = interaction.options.getString("say");
    await interaction.reply({
      content: string,
    });
  },
};
