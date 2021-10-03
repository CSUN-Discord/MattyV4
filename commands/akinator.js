/*
This command will allow you to play an akinator game
*/

const akinator = require("../modified-packages/discord.js-akinator/src/index");

module.exports = {
  name: "akinator",
  description: "Start an Akinator game.",
  permission: ["SEND_MESSAGES"],
  options: [
    {
      name: "game_type",
      description: "Choose to start or stop a reminder.",
      type: "STRING",
      choices: [
        {
          name: "animal",
          value: "animal",
        },
        {
          name: "character",
          value: "character",
        },
        {
          name: "object",
          value: "object",
        },
      ],
      required: true,
    },
  ],

  /**
   *
   * @param interaction
   * @returns {Promise<void>}
   */
  async execute(interaction) {
    const gameType = interaction.options.getString("game_type");

    await akinator(interaction, {
      //Defaults to "character"
      gameType: gameType,
    });
  },
};
