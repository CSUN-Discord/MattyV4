/*
This command integrates hydro homie 😎😎😎
*/

const { MessageEmbed } = require("discord.js");
const hydroHomieFunctions = require("../db/functions/hydroHomieFunctions");
const reminders = new Map();

module.exports = {
  name: "hydro-homie",
  description: `Hydro Homie 😎.`,
  options: [
    {
      name: "timer",
      description: "Notification alarm.",
      required: false,
      type: "SUB_COMMAND",
      options: [
        {
          name: "hour",
          description: "Hours before you need to drink water.",
          type: "NUMBER",
          required: true,
        },
        {
          name: "minute",
          description: "Minutes before you need to drink water.",
          type: "NUMBER",
          required: true,
        },
      ],
    },
    {
      name: "info",
      description:
        "Shows the importance of drinking water. Info based on Mayo Clinic..",
      required: false,
      type: "SUB_COMMAND",
    },
    {
      name: "reminder",
      description: "Start or stop a reminder.",
      required: false,
      type: "SUB_COMMAND",
      options: [
        {
          name: "reminder",
          description: "Choose to start or stop a reminder.",
          type: "STRING",
          choices: [
            {
              name: "start",
              value: "start",
            },
            {
              name: "stop",
              value: "stop",
            },
          ],
          required: true,
        },
      ],
    },
    {
      name: "log",
      description: "Log your water usage in oz.",
      required: false,
      type: "SUB_COMMAND",
      options: [
        {
          name: "oz",
          description: "OZ of water to log.",
          type: "NUMBER",
          required: true,
        },
      ],
    },
    {
      name: "stats",
      description: "View your water usage.",
      required: false,
      type: "SUB_COMMAND",
    },
  ],
  permission: ["SEND_MESSAGES"],

  /**
   *
   * @param interaction
   * @returns {Promise<void>}
   */
  async execute(interaction) {
    if (interaction.options.getSubcommand() === "timer") {
      const hour = interaction.options.getNumber("hour");
      const minute = interaction.options.getNumber("minute");
      const timer = hour * 3600000 + minute * 60000;

      interaction.reply({
        content: `Timer set, you will be reminded every ${msToTime(
          timer
        )} **after your start/restart the timer**.`,
        ephemeral: true,
      });
      await hydroHomieFunctions.setTime(interaction.user.id, minute, hour);
    } else if (interaction.options.getSubcommand() === "info") {
      const infoEmbed = new MessageEmbed()
        .setColor(2471891)
        .setTitle("How much should you drink every day?")
        .setDescription(
          "It's a simple question with no easy answer. Studies have produced varying recommendations over the years. But your individual water needs depend on many factors, including your health, how active you are and where you live. No single formula fits everyone. But knowing more about your body's need for fluids will help you estimate how much water to drink each day."
        )
        .addFields(
          {
            name: "Health benefits of water",
            value:
              "Water is your body's principal chemical component and makes up about 60 percent of your body weight. Your body depends on water to survive.Every cell, tissue and organ in your body needs water to work properly. For example, water: Gets rid of wastes through urination, perspiration and bowel movements \n\n •Keeps your temperature normal \n •Lubricates and cushions joints \n •Protects sensitive tissues \n\n Lack of water can lead to dehydration — a condition that occurs when you don't have enough water in your body to carry out normal functions. Even mild dehydration can drain your energy and make you tired.",
            inline: true,
          },
          {
            name: "How much water do you need?",
            value:
              "Every day you lose water through your breath, perspiration, urine and bowel movements. For your body to function properly, you must replenish its water supply by consuming beverages and foods that contain water. So how much fluid does the average, healthy adult living in a temperate climate need? The National Academies of Sciences, Engineering, and Medicine determined that an adequate daily fluid intake is: \n\n •About 15.5 cups (125 fl. oz.) of fluids for men \n •About 11.5 cups (125 fl. oz.) of fluids a day for women \n\n These recommendations cover fluids from water, other beverages and food. About 20 percent of daily fluid intake usually comes from food and the rest from drinks.",
            inline: false,
          }
        )
        .setAuthor(
          "Mayo Clinic",
          "https://qtxasset.com/styles/breakpoint_sm_default_480px_w/s3/FierceHealthcare-1510848155/2WFm5vUI_400x400.jpg/2WFm5vUI_400x400.jpg?g.X4eBSsB05SoQ8guptUZVgCvxSU5RdT&itok=K0tE0mIm"
        );

      await interaction.reply({ embeds: [infoEmbed], ephemeral: true });
    } else if (interaction.options.getSubcommand() === "reminder") {
      const reminder = interaction.options.getString("reminder");
      switch (reminder) {
        case "start":
          if (reminders.has(interaction.user)) {
            interaction.reply({
              content: `Stop your previous reminder first.`,
              ephemeral: true,
            });
          } else {
            await hydroHomieFunctions.setReminder(interaction.user.id, true);
            hydroHomieFunctions
              .getDocument(interaction.user.id)
              .then((data) => {
                let timer;
                try {
                  timer =
                    data[0].timer[0] * 3600000 + data[0].timer[1] * 60000 || 0;
                  if (timer < 300000) {
                    return interaction.reply({
                      content: `Set a reminder higher than 5 minutes.`,
                      ephemeral: true,
                    });
                  }

                  const interval = setInterval(() => {
                    interaction.member.send("Here is your water reminder.");
                  }, timer);
                  reminders.set(interaction.user, interval);

                  interaction.reply({
                    content: `Reminder has been enabled.`,
                    ephemeral: true,
                  });
                } catch (e) {
                  interaction.reply({
                    content: `There was an error with your request.`,
                    ephemeral: true,
                  });
                }
              });
          }
          break;
        case "stop":
          if (reminders.has(interaction.user)) {
            await hydroHomieFunctions.setReminder(interaction.user.id, false);
            clearInterval(reminders.get(interaction.user));
            reminders.delete(interaction.user);

            interaction.reply({
              content: `Reminder has been disabled.`,
              ephemeral: true,
            });
          } else {
            interaction.reply({
              content: `You didn't have a reminder to disable.`,
              ephemeral: true,
            });
          }

          break;
      }
    } else if (interaction.options.getSubcommand() === "log") {
      const amount = interaction.options.getNumber("oz");

      await hydroHomieFunctions.addWater(interaction.user.id, amount);

      hydroHomieFunctions.getDocument(interaction.user.id).then((data) => {
        let currentWater = 0;
        try {
          currentWater = data[0].waterDrank;
        } catch (e) {
          // console.log(e);
        }
        interaction.reply({
          content: `You have added ${amount} oz. of water for a new total of ${currentWater} oz.`,
          ephemeral: true,
        });
      });
    } else if (interaction.options.getSubcommand() === "stats") {
      hydroHomieFunctions.getDocument(interaction.user.id).then((data) => {
        let currentWater = 0;
        try {
          currentWater = data[0].waterDrank;
        } catch (e) {
          // console.log(e);
        }
        interaction.reply(
          `You have drank ${currentWater} fluid ounces of water.`
        );
      });
    } else {
      interaction.reply({ content: "No command chosen", ephemeral: true });
    }
  },
};

function msToTime(ms) {
  let seconds = (ms / 1000).toFixed(1);
  let minutes = (ms / (1000 * 60)).toFixed(1);
  let hours = (ms / (1000 * 60 * 60)).toFixed(1);
  let days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
  if (seconds < 60) return seconds + " Sec";
  else if (minutes < 60) return minutes + " Min";
  else if (hours < 24) return hours + " Hrs";
  else return days + " Days";
}
