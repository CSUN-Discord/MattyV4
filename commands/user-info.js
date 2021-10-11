/*
This command will send the info about a user
 */

const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "user-info",
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

    const userEmbed = new MessageEmbed()
      .setColor("RANDOM")
      .setAuthor(
        target.user.tag,
        target.user.avatarURL({ dynamic: true, size: 512 })
      )
      .setThumbnail(target.user.avatarURL({ dynamic: true, size: 512 }))
      .addField("ID", `${target.user.id}`)
      .addField(
        "Roles",
        `${
          target.roles.cache
            .map((r) => r)
            .join(" ")
            .replace("@everyone", " ") || "None"
        }`
      )
      .addField(
        "Member Since",
        `<t:${parseInt(target.joinedTimestamp / 1000)}:R>`,
        true
      )
      .addField(
        "Discord User Since",
        `<t:${parseInt(target.user.createdTimestamp / 1000)}:R>`,
        true
      );

    interaction.reply({ embeds: [userEmbed] });
  },
};
