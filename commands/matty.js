/*
This command will send you a picture of matty
or
This command will send always a matador
*/

const { MessageAttachment } = require("discord.js");

module.exports = {
  // ...new SlashCommandBuilder()
  //   .setName("matty")
  //   .setDescription("Whose Matty?")
  //   .addSubcommand((subcommand) =>
  //     subcommand.setName("matty").setDescription("Who really is Matty.")
  //   ),
  //
  // // .addSubcommand((subcommand) =>
  // //   subcommand.setName("onceamatador").setDescription("Always a Matador!")
  // // ),
  name: "matty",
  description: "Whose Matty?",
  options: [
    {
      name: "whomatty",
      description: "Who really is Matty.",
      required: false,
      type: "SUB_COMMAND",
    },
    {
      name: "onceamatador",
      description: "Always a Matador!",
      required: false,
      type: "SUB_COMMAND",
    },
  ],
  permission: ["SEND_MESSAGES"],
  cooldown: 5,

  /**
   *
   * @param interaction
   * @returns {Promise<void>}
   */
  async execute(interaction) {
    if (interaction.options.getSubcommand() === "whomatty") {
      const attachment = new MessageAttachment(`./media/matty/matty.jpg`);

      await interaction.reply({
        files: [attachment],
      });
    } else if (interaction.options.getSubcommand() === "onceamatador") {
      interaction.reply("Always a Matador!");
    }
  },
};
