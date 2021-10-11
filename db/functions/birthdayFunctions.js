const birthdaySchema = require("../schemas/birthdaySchema");
const { MessageEmbed } = require("discord.js");
const schedule = require("node-schedule");
const { guildId } = require("../../config.json");

module.exports = {
  addBirthday: async function (userId, month, day) {
    try {
      await birthdaySchema
        .findOneAndUpdate(
          {
            userId: userId,
          },
          {
            $set: {
              month: month,
              day: day,
            },
          },
          {
            upsert: true,
          }
        )
        .exec();
    } catch (e) {
      console.log(e);
    }
  },

  removeBirthday: function (userId, interaction) {
    try {
      birthdaySchema.findOneAndDelete(
        {
          userId: userId,
        },
        (err, data) => {
          if (err) {
            console.log(err);
          } else {
            if (data)
              interaction
                .editReply({
                  content: "User's birthday deleted from database.",
                  ephemeral: true,
                })
                .then((r) => {});
            else
              interaction
                .editReply({
                  content:
                    "User not found, maybe they didn't have a saved birthday.",
                  ephemeral: true,
                })
                .then((r) => {});
          }
        }
      );
    } catch (e) {}
  },

  getAllBirthday: function (interaction) {
    try {
      birthdaySchema.find({}, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          if (data.length < 1) {
            interaction
              .editReply({
                content: "No birthdays saved.",
                ephemeral: true,
              })
              .then((r) => {});
          } else {
            interaction
              .editReply({
                content: "All birthdays currently saved:",
                ephemeral: true,
              })
              .then((r) => {
                for (let i = 1; i < 13; i++) {
                  printBirthday(data, i, interaction);
                }
              });
          }
        }
      });
    } catch (e) {}
  },

  getDayBirthday: function (interaction, day) {
    try {
      birthdaySchema.find({ day: day }, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          if (data.length < 1) {
            interaction
              .editReply({
                content: `No birthdays on the ${ordinalSuffix(day)}.`,
                ephemeral: true,
              })
              .then((r) => {});
          } else {
            interaction
              .editReply({
                content: `All birthdays on the ${ordinalSuffix(day)}:`,
                ephemeral: true,
              })
              .then((r) => {
                for (let i = 1; i < 13; i++) {
                  printBirthday(data, i, interaction);
                }
              });
          }
        }
      });
    } catch (e) {}
  },

  getMonthBirthday: function (interaction, month) {
    try {
      birthdaySchema.find({ month: month }, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          if (data.length < 1) {
            interaction
              .editReply({
                content: `No birthdays on ${decryptMonth(month)}.`,
                ephemeral: true,
              })
              .then((r) => {});
          } else {
            interaction
              .editReply({
                content: `All birthdays on ${decryptMonth(month)}:`,
                ephemeral: true,
              })
              .then((r) => {
                printBirthday(data, month, interaction);
              });
          }
        }
      });
    } catch (e) {}
  },

  getPersonBirthday: function (interaction, id) {
    try {
      birthdaySchema.find({ userId: id }, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          if (data.length < 1) {
            interaction
              .editReply({
                content: `No birthdays on for ${interaction.guild.members.cache.get(
                  id
                )}.`,
                ephemeral: true,
              })
              .then((r) => {});
          } else {
            interaction
              .editReply({
                content: `Birthday for ${interaction.guild.members.cache.get(
                  id
                )}:`,
                ephemeral: true,
              })
              .then((r) => {
                printBirthday(data, data[0].month, interaction);
              });
          }
        }
      });
    } catch (e) {}
  },

  getDayMonthBirthday: function (interaction, month, day) {
    try {
      birthdaySchema.find({ month: month, day: day }, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          if (data.length < 1) {
            interaction
              .editReply({
                content: `No birthdays on ${decryptMonth(
                  month
                )}, ${ordinalSuffix(day)}.`,
                ephemeral: true,
              })
              .then((r) => {});
          } else {
            interaction
              .editReply({
                content: `All birthdays on ${decryptMonth(
                  month
                )}, ${ordinalSuffix(day)}:`,
                ephemeral: true,
              })
              .then((r) => {
                printBirthday(data, month, interaction);
              });
          }
        }
      });
    } catch (e) {}
  },

  birthday: function (client) {
    const guild = client.guilds.cache.get(guildId);
    const birthdayRole = guild.roles.cache.find(
      (r) => r.name === "BIRTHDAYYYY"
    );

    schedule.scheduleJob("0 0 * * *", function () {
      const usersWithRole = guild.roles.cache
        .get(birthdayRole.id)
        .members.map((m) => m.user.id);

      for (let i = 0; i < usersWithRole.length; i++) {
        const member = guild.members.cache.get(usersWithRole[i]);
        member.roles.remove(birthdayRole);
      }

      const today = new Date();
      try {
        birthdaySchema.find(
          { month: today.getMonth() + 1, day: today.getDate() },
          (err, data) => {
            if (err) {
              console.log(err);
            } else {
              if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                  const member = guild.members.cache.get(data[i].userId);
                  member.roles.add(birthdayRole);
                }
              }
            }
          }
        );
      } catch (e) {
        console.log(e);
      }
    });
  },
};

function monthFilter(month) {
  return (data) => data.month === month;
}

function monthArray(fullArray, month) {
  return fullArray.filter(monthFilter(month)).sort(function (a, b) {
    return a.day - b.day;
  });
}

function printBirthday(fullArray, month, interaction) {
  const birthdays = monthArray(fullArray, month);

  if (birthdays.length > 0) {
    let birthdayEmbed = new MessageEmbed()
      .setTitle("Birthdays:")
      .setDescription(`Birthdays in ${decryptMonth(month)}.`)
      .setColor("RANDOM");

    let counter = 0;
    for (let i = 0; i < birthdays.length; i++) {
      if (counter === 25) {
        interaction.followUp({ embeds: [birthdayEmbed] }).then((r) => {});
        birthdayEmbed = new MessageEmbed()
          .setTitle("Birthdays:")
          .setDescription(`Birthdays in ${decryptMonth(month)} cont.`)
          .setColor("RANDOM");
        counter = 0;
      }
      birthdayEmbed.addField(
        `\u200b`,
        `User: ${interaction.guild.members.cache.get(
          birthdays[i].userId
        )}: ${ordinalSuffix(birthdays[i].day)}`
      );
      counter += 1;
    }
    interaction.followUp({ embeds: [birthdayEmbed] }).then((r) => {});
  }
}

function decryptMonth(month) {
  // 😎
  switch (month) {
    case 1:
      return "January";
    case 2:
      return "February";
    case 3:
      return "March";
    case 4:
      return "April";
    case 5:
      return "May";
    case 6:
      return "June";
    case 7:
      return "July";
    case 8:
      return "August";
    case 9:
      return "September";
    case 10:
      return "October";
    case 11:
      return "November";
    case 12:
      return "December";
  }
}

function ordinalSuffix(i) {
  const j = i % 10,
    k = i % 100;
  if (j === 1 && k !== 11) {
    return i + "st";
  }
  if (j === 2 && k !== 12) {
    return i + "nd";
  }
  if (j === 3 && k !== 13) {
    return i + "rd";
  }
  return i + "th";
}
