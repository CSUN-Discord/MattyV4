/*
test command
*/

const { MessageEmbed} = require("discord.js");
// const {Collection} = require('discord.js')

const pollFunctions = require("../db/functions/pollFunctions");

module.exports = {
    name: "test",
    description: "test",
    permission: ["ADMINISTRATOR"],

    /**
     *
     * @param interaction
     * @returns {Promise<void>}
     */
    async execute(interaction) {

        interaction.deferReply()

        let queue = interaction.client.player.getQueue(interaction.guild.id);

        await queue.join(interaction.member.voice.channel);

        song = await queue.play("rap god", {requestedBy: interaction.user}).catch(songResponse => {
            console.log(songResponse)

        });
    },

};