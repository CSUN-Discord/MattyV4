const {GiveawaysManager} = require('discord-giveaways');
const giveawaySchema = require("../schemas/giveawaySchema");
module.exports = (client) => {
    const GiveawayManagerWithOwnDatabase = class extends GiveawaysManager {
        async getAllGiveaways() {
            return await giveawaySchema.find().lean().exec();
        }

        async saveGiveaway(messageId, giveawayData) {
            await giveawaySchema.create(giveawayData);
            return true;
        }

        async editGiveaway(messageId, giveawayData) {
            await giveawaySchema.updateOne({messageId}, giveawayData, {omitUndefined: true}).exec();
            return true;
        }

        async deleteGiveaway(messageId) {
            await giveawaySchema.deleteOne({messageId}).exec();
            return true;
        }
    }

    const manager = new GiveawayManagerWithOwnDatabase(client, {
        default: {
            botsCanWin: false,
            embedColor: '#FF0000',
            embedColorEnd: '#000000',
            reaction: '🎉'
        }
    });
    client.giveawaysManager = manager;
}