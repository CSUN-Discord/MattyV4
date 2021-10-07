const hydroHomieSchema = require("../schemas/hydroHomieSchema");

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
};
