/*
event that happens on start up to display activity
 */

const mongo = require("../db/mongo");
let dbObjects = require("../db/dbObjects");
const hydroHomieFunctions = require("../db/functions/hydroHomieFunctions");

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

    hydroHomieFunctions.startReminders(client);

    console.log(`Ready! Logged in as ${client.user.tag}`);
  },
};
