const hydroHomieSchema = require("../schemas/hydroHomieSchema");
const { reminders } = require("../dbObjects");

module.exports = {
  addWater: async function (userId, ounces) {
    try {
      await hydroHomieSchema
        .findOneAndUpdate(
          {
            userId: userId,
          },
          {
            $inc: {
              waterDrank: ounces,
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

  getDocument: async function (userId) {
    try {
      return hydroHomieSchema.find({
        userId: userId,
      });
    } catch (e) {
      console.log(e);
      return null;
    }
  },

  setTime: async function (userId, minutes, hour) {
    try {
      await hydroHomieSchema
        .findOneAndUpdate(
          {
            userId: userId,
          },
          {
            $set: {
              timer: [hour, minutes],
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

  setReminder: async function (userId, reminderOn) {
    try {
      await hydroHomieSchema
        .findOneAndUpdate(
          {
            userId: userId,
          },
          {
            $set: {
              reminder: reminderOn,
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

  startReminders: function (client) {
    try {
      hydroHomieSchema.find(
        {
          reminder: true,
        },
        (error, data) => {
          if (error) {
            console.log(error);
          } else {
            for (let i = 0; i < data.length; i++) {
              try {
                client.users.fetch(data[i].userId).then((user) => {
                  const timer =
                    data[i].timer[0] * 3600000 + data[i].timer[1] * 60000 || 0;
                  if (timer > 299999) {
                    const interval = setInterval(() => {
                      try {
                        if (user != null)
                          user.send("Here is your water reminder.");
                      }catch (e) {
                        console.log(e)
                      }
                    }, timer);
                    reminders.set(user, interval);
                  }
                });
              } catch (e) {
                console.log(e);
              }
            }
          }
        }
      );
    } catch (e) {}
  },
};
