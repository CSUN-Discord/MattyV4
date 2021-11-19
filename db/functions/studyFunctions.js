const studySchema = require("../schemas/studySchema");

module.exports = {
    addVerifiedUser: async function (userId) {
        try {
            await studySchema
                .findOneAndUpdate(
                    {
                        userId: userId,
                    },
                    {},
                    {
                        upsert: true,
                    }
                )
                .exec();
        } catch (e) {
            console.log(e);
        }
    },

    removeVerifiedUser: async function (userId) {
        try {
            return await studySchema
                .findOneAndRemove(
                    {
                        userId: userId,
                    })
        } catch (e) {
            console.log(e);
        }
    },
}