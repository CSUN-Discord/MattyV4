/*
This command will send the suggestion to the mod channel
*/

const { SlashCommandBuilder } = require("@discordjs/builders");
const { MessageEmbed } = require("discord.js");
const { suggestionsChannelId } = require("../validation/channels.json");
const pollFunctions = require("../db/functions/pollFunctions");

module.exports = {
  ...new SlashCommandBuilder()
    .setName("suggestion")
    .addStringOption((option) =>
      option
        .setName("suggestion")
        .setDescription("The suggestion you want to send.")
        .setRequired(true)
    )
    .setDescription("Sends a suggestion to the mod team."),

  permission: ["SEND_MESSAGES"],

  /**
   *
   * @param interaction
   * @returns {Promise<void>}
   */
  async execute(interaction) {
    const string = interaction.options.getString("suggestion");

    const responseEmbed = new MessageEmbed()
      .setColor("AQUA")
      .setDescription(`${interaction.member}'s new suggestion.`)
      .addField("Suggestion: ", `${string}`);

    await interaction.reply({
      content: "Submission received.",
      ephemeral: true,
    });

    interaction.client.channels.cache
      .get(suggestionsChannelId)
      .send({ embeds: [responseEmbed] })
      .then((msg) => {
        msg.react(`👍`);
        msg.react(`👎`);
        pollFunctions.addPoll(msg.id);
      });
  },
};
