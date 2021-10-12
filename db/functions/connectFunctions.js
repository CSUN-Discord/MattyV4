const connectSchema = require("../schemas/connectSchema");

module.exports = {
  addWin: async function (userId) {
    try {
      await connectSchema
        .findOneAndUpdate(
          {
            userId: userId,
          },
          {
            $inc: {
              wins: 1,
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

  addLoss: async function (userId) {
    try {
      await connectSchema
        .findOneAndUpdate(
          {
            userId: userId,
          },
          {
            $inc: {
              losses: 1,
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
      return connectSchema.find({
        userId: userId,
      });
    } catch (e) {
      console.log(e);
      return null;
    }
  },
};
