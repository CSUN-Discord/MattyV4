/*
    Emitted whenever a member changes voice state - e.g. joins/leaves a channel, mutes/unmutes.
 */

// const channelsFunctions = require("../db/functions/channelsFunctions.js");

const channelsFunctions = require("../db/functions/channelsFunctions.js");
const {client} = require("../index");
module.exports = {
    name: "voiceStateUpdate",

    /**
     *
     * @param oldState
     * @param newState
     * @returns {Promise<void>}
     */
    async execute(oldState, newState) {
        try {
            const channelIds = await channelsFunctions.getChannelId(newState.guild.id);
            if (channelIds.length < 1) return;
            const autoLofiChannelId = channelIds[0].channels.autoLofi || null;
            const lofiTheme = channelIds[0].lofiTheme || null;

            if (autoLofiChannelId == null)
                return;
            if (lofiTheme == null)
                return;

            if (newState.channelId === autoLofiChannelId && oldState.channelId !== autoLofiChannelId) {
                if (newState.guild.me.voice.channelId) {
                    return;
                }

                try {
                    await client.distube.playVoiceChannel(newState.channel, channelIds[0].lofiTheme);
                    const queue = await client.distube.getQueue(newState.channel);
                    queue.setRepeatMode(2);
                } catch (e) {
                    console.log(e)
                    console.log("Can't play station.")
                }
            }
        } catch (e) {
            console.log(e)
        }

    },
};
