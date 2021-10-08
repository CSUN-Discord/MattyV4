/*
This command will prune the messages of the channel or specific user
*/

const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");

module.exports = {
  ...new SlashCommandBuilder()
    .setName("prune")
    .addNumberOption((option) =>
      option
        .setName("amount")
        .setDescription(
          "The amount of messages to delete from a channel or target."
        )
        .setRequired(true)
    )
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user to delete the messages of.")
        .setRequired(false)
    )
    .setDescription("Prunes messages from the channel or a specific user."),
  permission: ["MANAGE_MESSAGES"],

  /**
   *
   * @param interaction
   * @returns {Promise<void>}
   */
  async execute(interaction) {
    const amount = interaction.options.getNumber("amount");
    const user = interaction.options.getMember("user");

    const messages = await interaction.channel.messages.fetch();

    const responseEmbed = new MessageEmbed().setColor("DARK_RED");

    if (user) {
      let counter = 0;
      const filtered = [];
      (await messages).filter((m) => {
        if (m.author.id === user.id && amount > counter) {
          filtered.push(m);
          counter++;
        }
      });
      await interaction.channel.bulkDelete(filtered, true).then((messages) => {
        responseEmbed.setDescription(
          `🧹 Cleared ${messages.size} messages from ${user}.`
        );
        interaction.reply({ embeds: [responseEmbed], ephemeral: true });
      });
    } else {
      await interaction.channel.bulkDelete(amount, true).then((messages) => {
        responseEmbed.setDescription(
          `🧹 Cleared ${messages.size} messages from this channel.`
        );
        interaction.reply({ embeds: [responseEmbed], ephemeral: true });
      });
    }
  },
};
