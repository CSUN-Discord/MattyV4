/*
This command will update the users school year
*/

const { SlashCommandBuilder } = require("@discordjs/builders");
// const { MessageEmbed } = require("discord.js");

module.exports = {
  ...new SlashCommandBuilder()
    .setName("updateyear")
    .addRoleOption((option) =>
      option
        .setName("year")
        .setDescription("The school year to update to.")
        .setRequired(true)
    )
    .setDescription("Updates your school year role."),
  permission: ["SEND_MESSAGES"],
  cooldown: 5,

  /**
   *
   * @param interaction
   * @returns {Promise<void>}
   */
  execute: async function (interaction) {
    const year = interaction.options.getRole("year");

    let freshman = interaction.guild.roles.cache.find(
      (r) => r.name === "Freshman"
    );
    const sophomore = interaction.guild.roles.cache.find(
      (r) => r.name === "Sophomore"
    );
    const junior = interaction.guild.roles.cache.find(
      (r) => r.name === "Junior"
    );
    const senior = interaction.guild.roles.cache.find(
      (r) => r.name === "Senior"
    );
    const alumni = interaction.guild.roles.cache.find(
      (r) => r.name === "Alumni"
    );
    const masters = interaction.guild.roles.cache.find(
      (r) => r.name === "Masters"
    );

    if (
      year === freshman ||
      year === sophomore ||
      year === junior ||
      year === senior ||
      year === alumni ||
      year === masters
    ) {
      if (
        interaction.member.roles.cache.some((role) => role.id === freshman.id)
      ) {
        interaction.member.roles.remove(freshman);
      } else if (
        interaction.member.roles.cache.some((role) => role.id === sophomore.id)
      ) {
        interaction.member.roles.remove(sophomore);
      } else if (
        interaction.member.roles.cache.some((role) => role.id === junior.id)
      ) {
        interaction.member.roles.remove(junior);
      } else if (
        interaction.member.roles.cache.some((role) => role.id === senior.id)
      ) {
        interaction.member.roles.remove(senior);
      } else if (
        interaction.member.roles.cache.some((role) => role.id === alumni.id)
      ) {
        interaction.member.roles.remove(sophomore);
      } else if (
        interaction.member.roles.cache.some((role) => role.id === masters.id)
      ) {
        interaction.member.roles.remove(masters);
      }
      interaction.member.roles.add(year);
      interaction.channel.send(
        `<@&${
          interaction.guild.roles.cache.find((r) => r.name === "Mod").id
        }> ${interaction.member} has updated their role.`
      );
      interaction.reply({ content: "Updated successfully.", ephemeral: true });
    } else
      interaction.reply({ content: "Couldn't update year.", ephemeral: true });
  },
};
