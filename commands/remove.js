/*
This command will kick the mentioned user with a reason
or
This command will ban the mentioned user with a reason
 */

const { MessageEmbed } = require("discord.js");
const { modOnlyChannelId } = require("../validation/channels.json");

module.exports = {
  name: "remove",
  description: "Removes or bans a specific user.",
  options: [
    {
      name: "kick",
      description: "Kicks someone.",
      required: false,
      type: "SUB_COMMAND",
      options: [
        {
          name: "user",
          description: "User to kick.",
          type: "USER",
          required: true,
        },
        {
          name: "reason",
          description: "Reason to kick the user.",
          type: "STRING",
          required: true,
        },
      ],
    },
    {
      name: "ban",
      description: "Bans someone.",
      required: false,
      type: "SUB_COMMAND",
      options: [
        {
          name: "user",
          description: "User to kick.",
          type: "USER",
          required: true,
        },
        {
          name: "reason",
          description: "Reason to kick the user.",
          type: "STRING",
          required: true,
        },
      ],
    },
  ],
  permission: ["BAN_MEMBERS"],

  /**
   *
   * @param interaction
   * @returns {Promise<void>}
   */
  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const reason = interaction.options.getString("reason");
    const member = interaction.options.getMember("user");

    if (interaction.options.getSubcommand() === "kick") {
      const responseEmbed = new MessageEmbed()
        .setColor("RED")
        .setDescription(`${interaction.member} has kicked ${user} (${user.tag})`)
        .addField("With the reason:", `${reason}`);

      interaction.client.channels.cache
        .get(modOnlyChannelId)
        .send({ embeds: [responseEmbed] });

      await member.kick(reason);
      await interaction.reply("User is kicked.");
    } else if (interaction.options.getSubcommand() === "ban") {
      const responseEmbed = new MessageEmbed()
        .setColor("RED")
        .setDescription(`${interaction.member} has banned ${user} (${user.tag})`)
        .addField("With the reason:", `${reason}`);

      interaction.client.channels.cache
        .get(modOnlyChannelId)
        .send({ embeds: [responseEmbed] });

      await member.ban({ reason: reason });
      await interaction.reply("User is banned.");
    } else {
      interaction.reply({ content: "No command chosen", ephemeral: true });
    }
  },
};
