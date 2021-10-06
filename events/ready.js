/*
event that happens on start up to display activity
 */

const mongo = require("../db/mongo");
const dbObjects = require("../db/dbObjects");

module.exports = {
  name: "ready",
  once: true,
  /**
   * @param {Client} client
   */
  async execute(client) {
    client.user.setActivity("with discord.js documentation", {
      type: "PLAYING",
    });

    await mongo().then(async (mongoose) => {
      console.log(`Connected to database.`);
      dbObjects.mongoo = mongoose;
    });

    console.log(`Ready! Logged in as ${client.user.tag}`);
  },
};
