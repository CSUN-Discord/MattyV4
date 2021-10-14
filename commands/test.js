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

        const embed = new MessageEmbed()
            .setColor("RANDOM")
            .setTitle("test")


        const message = await interaction.reply({ embeds: [embed], fetchReply: true })
            await message.react("1️⃣")
            await message.react("2️⃣")


        await pollFunctions.addPoll(message.id);
    },

};