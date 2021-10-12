/*
This command will send the info about a user
 */

const { MessageEmbed } = require("discord.js");
const hydroHomieFunctions = require("../db/functions/hydroHomieFunctions");
const connectFunctions = require("../db/functions/connectFunctions");

module.exports = {
  name: "user-info-app",
  type: "USER",
  context: true,
  permission: ["SEND_MESSAGES"],

  /**
   *
   * @param interaction
   * @returns {Promise<void>}
   */
  async execute(interaction) {
    const target = await interaction.guild.members.fetch(interaction.targetId);

    const hydroHomieDocument = await hydroHomieFunctions.getDocument(
      target.user.id
    );
    const connectDocument = await connectFunctions.getDocument(target.user.id);

    console.log(hydroHomieDocument[0]);

    let connectWins = 0;
    let connectLosses = 0;

    if (connectDocument[0] != null) {
      connectWins = connectDocument[0].wins;
      connectLosses = connectDocument[0].losses;
    }

    let waterDrank = 0;
    if (hydroHomieDocument[0] != null)
      waterDrank = hydroHomieDocument[0].waterDrank;

    const userEmbed = new MessageEmbed()
      .setColor("RANDOM")
      .setAuthor(
        target.user.tag,
        target.user.avatarURL({ dynamic: true, size: 512 })
      )
      .setThumbnail(target.user.avatarURL({ dynamic: true, size: 512 }))
      .addFields([
        {
          name: "ID",
          value: `${target.user.id}`,
        },
        {
          name: "Roles",
          value: `${
            target.roles.cache
              .map((r) => r)
              .join(" ")
              .replace("@everyone", " ") || "None"
          }`,
        },
        {
          name: "Member Since",
          value: `<t:${parseInt(target.joinedTimestamp / 1000)}:R>`,
          inline: true,
        },
        {
          name: "Discord User Since",
          value: `<t:${parseInt(target.user.createdTimestamp / 1000)}:R>`,
          inline: true,
        },
        {
          name: "Connect-4",
          value: `Wins: ${connectWins}\n Losses: ${connectLosses}`,
        },
        {
          name: "Water Drank",
          value: `${waterDrank} oz.`,
        },
      ]);

    interaction.reply({ embeds: [userEmbed] });
  },
};
