const buttonMenu = require("./buttonMenu");
const Discord = require("discord.js");

/**
 * @param {boolean} useButtons If true, use buttons. If false, use text input
 * @param {any} input The Message Sent by the User.
 * @param {Discord.Message} botMessage The Message for the Bot to Send, also the message which will contain the buttons (Max. 8). MUST BE AN EMBED!
 *
 */

module.exports = async function awaitInput(
  input,
  botMessage,
  isGuessFilter,
  translations
) {
  let yes = new Discord.MessageButton()
    .setLabel(translations.yes)
    .setStyle("SECONDARY")
    .setEmoji("✅")
    .setCustomId("✅");

  let no = new Discord.MessageButton()
    .setLabel(translations.no)
    .setStyle("SECONDARY")
    .setEmoji("❌")
    .setCustomId("❌");

  let idk = new Discord.MessageButton()
    .setLabel(translations.dontKnow)
    .setStyle("SECONDARY")
    .setEmoji("❓")
    .setCustomId("❓");

  let probably = new Discord.MessageButton()
    .setLabel(translations.probably)
    .setStyle("SECONDARY")
    .setEmoji("👍")
    .setCustomId("👍");

  let probablyNot = new Discord.MessageButton()
    .setLabel(translations.probablyNot)
    .setStyle("SECONDARY")
    .setEmoji("👎")
    .setCustomId("👎");

  let back = new Discord.MessageButton()
    .setLabel(translations.back)
    .setStyle("SECONDARY")
    .setEmoji("⏪")
    .setCustomId("⏪");

  let stop = new Discord.MessageButton()
    .setLabel(translations.stop)
    .setStyle("DANGER")
    .setEmoji("🛑")
    .setCustomId("🛑");

  let answerTypes;

  if (isGuessFilter) {
    answerTypes = [yes, no];
  } else {
    answerTypes = [yes, no, idk, probably, probablyNot, back, stop];
  }

  let choice = await buttonMenu(
    input.client,
    input,
    botMessage,
    answerTypes,
    60000
  );
  if (!choice) return null;
  else return choice;
};
