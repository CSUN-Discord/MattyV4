/*
event that listens for message creation
 */

const Chat = require("easy-discord-chatbot");
const chat = new Chat({ name: "Matty" });

const {
  marketplaceChannelId,
  mattyChannelId,
  roommateChannelId,
  welcomeChannelId,
    ventChannelId,
} = require("../validation/channels.json");
module.exports = {
  name: "messageCreate",

  /**
   *
   * @param message
   * @returns {Promise<void>}
   */
  async execute(message) {
    if (message.channel.id === mattyChannelId && !message.author.bot) {
      let reply = await chat.chat(message.content);
      await message.reply(reply);
    }

    if (message.channel.id === marketplaceChannelId && !message.author.bot) {
      message
        .reply("Use the slash command **/marketplace**.")
        .then((msg) => {
          setTimeout(() => msg.delete(), 10000);
          message.delete();
        })
        .catch();
    }

    if (message.channel.id === roommateChannelId && !message.author.bot) {
      message
        .reply("Use the slash command **/roommate**.")
        .then((msg) => {
          setTimeout(() => msg.delete(), 10000);
          message.delete();
        })
        .catch();
    }

    if (
      message.channel.id === welcomeChannelId &&
      !message.author.bot &&
      !message.member.roles.cache.some((role) => role.name === "Admin") &&
      !message.member.roles.cache.some((role) => role.name === "Mod") &&
      !message.member.roles.cache.some((role) => role.name === "Helpers")
    ) {
      message
        .reply("Use the slash command **/answer-the-bot**.")
        .then((msg) => {
          setTimeout(() => msg.delete(), 10000);
          message.delete();
        })
        .catch();
    }

      if (
          message.channel.id === ventChannelId &&
          !message.author.bot &&
          !message.member.roles.cache.some((role) => role.name === "Admin") &&
          !message.member.roles.cache.some((role) => role.name === "Mod") &&
          !message.member.roles.cache.some((role) => role.name === "Helpers")
      ) {
          message.delete();
      }
  },
};
