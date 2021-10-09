/*
event that listens for message creation
 */

const Chat = require("easy-discord-chatbot");
const chat = new Chat({ name: "Matty" });

module.exports = {
  name: "messageCreate",

  /**
   *
   * @param message
   * @returns {Promise<void>}
   */
  async execute(message) {
    if (message.channel.id === "894103257335603270" && !message.author.bot) {
      let reply = await chat.chat(message.content);
      await message.reply(reply);
    }

    if (message.channel.id === "523967992917393418" && !message.author.bot) {
      message
        .reply("Use the slash command **/marketplace**.")
        .then((msg) => {
          setTimeout(() => msg.delete(), 10000);
          message.delete();
        })
        .catch();
    }

    if (message.channel.id === "570809696135544835" && !message.author.bot) {
      message
        .reply("Use the slash command **/roommate**.")
        .then((msg) => {
          setTimeout(() => msg.delete(), 10000);
          message.delete();
        })
        .catch();
    }

    if (
      message.channel.id === "496834947894476810" &&
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
  },
};
