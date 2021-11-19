const channelsSchema = require("../schemas/channelsSchema");

module.exports = {
    addMarketplace: async function (guildId, channelId) {
        try {
            await channelsSchema
                .findOneAndUpdate(
                    {
                        guildId: guildId,
                    },
                    {
                        $set: {
                            'channels.marketplace': channelId,
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

    addRoomate: async function (guildId, channelId) {
        try {
            await channelsSchema
                .findOneAndUpdate(
                    {
                        guildId: guildId,
                    },
                    {
                        $set: {
                            'channels.roommate': channelId,
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

    addWelcome: async function (guildId, channelId) {
        try {
            await channelsSchema
                .findOneAndUpdate(
                    {
                        guildId: guildId,
                    },
                    {
                        $set: {
                            'channels.welcome': channelId,
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

    addModOnly: async function (guildId, channelId) {
        try {
            await channelsSchema
                .findOneAndUpdate(
                    {
                        guildId: guildId,
                    },
                    {
                        $set: {
                            'channels.modOnly': channelId,
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

    addSuggestion: async function (guildId, channelId) {
        try {
            await channelsSchema
                .findOneAndUpdate(
                    {
                        guildId: guildId,
                    },
                    {
                        $set: {
                            'channels.suggestions': channelId,
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

    addRoleChange: async function (guildId, channelId) {
        try {
            await channelsSchema
                .findOneAndUpdate(
                    {
                        guildId: guildId,
                    },
                    {
                        $set: {
                            'channels.roleChange': channelId,
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

    addVent: async function (guildId, channelId) {
        try {
            await channelsSchema
                .findOneAndUpdate(
                    {
                        guildId: guildId,
                    },
                    {
                        $set: {
                            'channels.vent': channelId,
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

    addPlannedMeetups: async function (guildId, channelId) {
        try {
            await channelsSchema
                .findOneAndUpdate(
                    {
                        guildId: guildId,
                    },
                    {
                        $set: {
                            'channels.plannedMeetups': channelId,
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

    addVerifiedPlannedMeetups: async function (guildId, channelId) {
        try {
            await channelsSchema
                .findOneAndUpdate(
                    {
                        guildId: guildId,
                    },
                    {
                        $set: {
                            'channels.verifiedPlannedMeetups': channelId,
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

    addAudit: async function (guildId, channelId) {
        try {
            await channelsSchema
                .findOneAndUpdate(
                    {
                        guildId: guildId,
                    },
                    {
                        $set: {
                            'channels.audit': channelId,
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

    addAutoLofi: async function (guildId, channelId) {
        try {
            await channelsSchema
                .findOneAndUpdate(
                    {
                        guildId: guildId,
                    },
                    {
                        $set: {
                            'channels.autoLofi': channelId,
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

    addLofiStation: async function (guildId, youtubeURL) {
        try {
            await channelsSchema
                .findOneAndUpdate(
                    {
                        guildId: guildId,
                    },
                    {
                        $set: {
                            lofiTheme: youtubeURL,
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

    getChannelId: async function (guildId) {
        try {
            return await channelsSchema
                .find({
                    guildId: guildId
                });
        } catch (e) {
            console.log(e);
        }
    },
}