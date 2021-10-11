/*
This command adds, deletes, and allows people to see birthdays
*/

const birthdayFunctions = require("../db/functions/birthdayFunctions");

module.exports = {
  name: "birthday",
  description: "Birthday commands",
  permission: ["SEND_MESSAGES"],
  options: [
    {
      name: "add",
      description: "Adds someone's birthday into the database.",
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
          name: "month",
          description: "Month they were born on.",
          type: "NUMBER",
          required: true,
          choices: [
            {
              name: "January",
              value: 1,
            },
            {
              name: "February",
              value: 2,
            },
            {
              name: "March",
              value: 3,
            },
            {
              name: "April",
              value: 4,
            },
            {
              name: "May",
              value: 5,
            },
            {
              name: "June",
              value: 6,
            },
            {
              name: "July",
              value: 7,
            },
            {
              name: "August",
              value: 8,
            },
            {
              name: "September",
              value: 9,
            },
            {
              name: "October",
              value: 10,
            },
            {
              name: "November",
              value: 11,
            },
            {
              name: "December",
              value: 12,
            },
          ],
        },
        {
          name: "day",
          description: "Day they were born on.",
          type: "NUMBER",
          required: true,
        },
      ],
    },
    {
      name: "remove",
      description: "Removes someone's birthday from the database.",
      required: false,
      type: "SUB_COMMAND",
      options: [
        {
          name: "user",
          description: "User to kick.",
          type: "USER",
          required: true,
        },
      ],
    },
    {
      name: "view",
      description: "View everyone's birthday.",
      required: false,
      type: "SUB_COMMAND",
      options: [
        {
          name: "user",
          description: "User's birthday to view.",
          type: "USER",
        },
        {
          name: "month",
          description: "Month they were born on.",
          type: "NUMBER",
          choices: [
            {
              name: "January",
              value: 1,
            },
            {
              name: "February",
              value: 2,
            },
            {
              name: "March",
              value: 3,
            },
            {
              name: "April",
              value: 4,
            },
            {
              name: "May",
              value: 5,
            },
            {
              name: "June",
              value: 6,
            },
            {
              name: "July",
              value: 7,
            },
            {
              name: "August",
              value: 8,
            },
            {
              name: "September",
              value: 9,
            },
            {
              name: "October",
              value: 10,
            },
            {
              name: "November",
              value: 11,
            },
            {
              name: "December",
              value: 12,
            },
          ],
        },
        {
          name: "day",
          description: "Day they were born on.",
          type: "NUMBER",
        },
      ],
    },
  ],

  /**
   *
   * @param interaction
   * @returns {Promise<void>}
   */
  async execute(interaction) {
    await interaction.deferReply();
    const member = interaction.options.getMember("user");
    const month = interaction.options.getNumber("month");
    const day = interaction.options.getNumber("day");

    if (interaction.options.getSubcommand() === "add") {
      if (day && (day > 31 || day < 1))
        return interaction.editReply({
          content: "Incorrect day.",
          ephemeral: true,
        });
      await birthdayFunctions.addBirthday(member.id, month, day);
      await interaction.editReply({
        content: `${member}'s birthday added to database.`,
        ephemeral: true,
      });
    } else if (interaction.options.getSubcommand() === "remove") {
      if (
        interaction.member.roles.cache.some((role) => role.name === "Mod") ||
        interaction.member.roles.cache.some(
          (role) => role.name === "Helpers"
        ) ||
        interaction.member.roles.cache.some((role) => role.name === "Admin") ||
        interaction.member.id === "497158229881651220"
      ) {
        birthdayFunctions.removeBirthday(member.id, interaction);
      } else
        await interaction.editReply({
          content: `Message ${
            interaction.guild.members.cache.get("497158229881651220") || "Kaeya"
          } or someone from the mod team to remove a user's birthday.`,
          ephemeral: true,
        });
    } else if (interaction.options.getSubcommand() === "view") {
      if (member) {
        console.log("display specific person's birthday");
      }
      if (day && (day > 31 || day < 1))
        return interaction.editReply({
          content: "Incorrect day.",
          ephemeral: true,
        });
      else {
        if (!day && !month) {
          birthdayFunctions.getAllBirthday(interaction);
        } else if (day && !month) {
          birthdayFunctions.getDayBirthday(interaction, day);
        } else if (!day && month) {
          birthdayFunctions.getMonthBirthday(interaction, month);
        } else if (day && month) {
          birthdayFunctions.getDayMonthBirthday(interaction, month, day);
        } else {
          await interaction.editReply({
            content: "Incorrect command options.",
            ephemeral: true,
          });
        }
      }
    } else {
      await interaction.editReply({
        content: "Incorrect Command",
        ephemeral: true,
      });
    }
  },
};
