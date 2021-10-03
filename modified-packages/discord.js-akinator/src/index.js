const Discord = require("discord.js");
const { Aki } = require("aki-api");
const awaitInput = require("./input");
const games = new Set();
const attemptingGuess = new Set();

// this simply gets the user's reply from a button interaction (that is, if the user has chosen to enable buttons)
function getButtonReply(interaction) {
  interaction = interaction.customId;

  if (interaction === "✅") {
    //yes
    return "y";
  } else if (interaction === "❌") {
    //no
    return "n";
  } else if (interaction === "❓") {
    //don't know
    return "i";
  } else if (interaction === "👍") {
    //probably
    return "p";
  } else if (interaction === "👎") {
    //probably not
    return "pn";
  } else if (interaction === "⏪") {
    //back
    return "b";
  } else if (interaction === "🛑") {
    //stop game
    return "s";
  } else return null;
}

/**
 * Play a Game of Akinator.
 *
 * Simply pass in the Discord `Message` or `CommandInteraction` Sent by the User to Setup the Game.
 *
 * __Game Options__
 *
 * - `gameType` - The Type of Akinator Game to Play. (`animal`, `character` or `object`)
 *
 * @param {Discord.Message | Discord.CommandInteraction} input The Message Sent by the User.
 * @param {object} options The Options for the Game.
 * @param {"character" | "animal" | "object"} [options.gameType="character"] The Type of Akinator Game to Play. Defaults to "character".
 * @returns {Promise<Discord.Message>} Discord.js Akinator Game
 * @example
 * const { Client, Intents } = require("discord.js");
 * const akinator = require("discord.js-akinator");
 * const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
 *
 * client.on("ready", () => {
 *     console.log("Bot is Online")
 * });
 *
 *
 * //Example options
 *
 * const gameType = "character"; //The Type of Akinator Game to Play. ("animal", "character" or "object")
 *
 * client.on("messageCreate", async message => {
 *     if(message.content.startsWith(`${PREFIX}akinator`)) {
 *         akinator(message, {
 *             gameType: gameType, //Defaults to "character"
 *         });
 *     }
 * });
 */

module.exports = async function (input, options = {}) {
  let inputData = {};
  try {
    // configuring game options if not specified
    options.gameType = options.gameType || "character";

    options.gameType = options.gameType.toLowerCase();

    // error handling
    if (!input)
      return console.log(
        "Discord.js Akinator Error: Message or CommandInteraction was not Provided."
      );
    // if the input is not a Discord.Message or CommandInteraction, return an error
    if (!input.client)
      return console.log(
        "Discord.js Akinator Error: Message or CommandInteration Provided was Invalid."
      );
    if (!input.guild)
      return console.log(
        "Discord.js Akinator Error: Cannot be used in Direct Messages."
      );
    if (!["animal", "character", "object"].includes(options.gameType))
      return console.log(
        `Discord.js Akinator Error: Game Type "${options.gameType}" Not Found. Choose from: "animal", "character" or "object".`
      );

    try {
      (inputData.client = input.client),
        (inputData.guild = input.guild),
        (inputData.author = input.author ? input.author : input.user),
        (inputData.channel = input.channel);
    } catch {
      return console.log(
        "Discord.js Akinator Error: Failed to Parse Input for Use."
      );
    }

    // defining for easy use
    let usertag = inputData.author.tag;
    let avatar = inputData.author.displayAvatarURL();

    // check if a game is being hosted by the player
    if (games.has(inputData.author.id)) {
      let alreadyPlayingEmbed = new Discord.MessageEmbed()
        .setAuthor(usertag, avatar)
        .setTitle(`❌ ${"You're already playing!"}`)
        .setDescription(
          `**${`You're already playing a game of Akinator. Press the \`Stop\` button on the previous game's message to cancel your game.`}**`
        )
        .setColor("RED");

      if (input.commandName && (!input.replied || !input.deferred)) {
        // check if it's a slash command and see if it's already been replied or deferred
        input.reply({ embeds: [alreadyPlayingEmbed] });
      } else {
        input.channel.send({ embeds: [alreadyPlayingEmbed] });
      }
      return;
    }

    // adding the player into the game
    games.add(inputData.author.id);

    let startingEmbed = new Discord.MessageEmbed()
      .setAuthor(usertag, avatar)
      .setTitle(`${"Starting Game..."}`)
      .setDescription(`**${"The game will start in a few seconds..."}**`)
      .setColor("RANDOM");

    let startingMessage;

    if (input.commandName && (!input.replied || !input.deferred)) {
      // check if it's a slash command and hasn't been replied or deferred
      startingMessage = await input.reply({ embeds: [startingEmbed] });
    } else {
      startingMessage = await input.channel.send({ embeds: [startingEmbed] });
    }

    // get translation object for the language
    let translations = require(`${__dirname}/translations/en.json`);

    // starts the game
    let gameTypeRegion =
      options.gameType == "animal"
        ? "en_animals"
        : options.gameType == "character"
        ? "en"
        : "en_objects";
    let aki = new Aki({ region: gameTypeRegion });
    await aki.start();

    let notFinished = true;
    let stepsSinceLastGuess = 0;
    let hasGuessed = false;

    let noResEmbed = new Discord.MessageEmbed()
      .setAuthor(usertag, avatar)
      .setTitle(translations.gameEnded)
      .setDescription(
        `**${inputData.author.username}, ${translations.gameEndedDesc}**`
      )
      .setColor("RANDOM");

    let akiEmbed = new Discord.MessageEmbed()
      .setAuthor(usertag, avatar)
      .setTitle(`${translations.question} ${aki.currentStep + 1}`)
      .setDescription(`**${translations.progress}: 0%\n${aki.question}**`)
      .setColor("RANDOM");

    if (input.user) await input.deleteReply();
    else await startingMessage.delete();

    let akiMessage = await inputData.channel.send({ embeds: [akiEmbed] });

    // if message was deleted, quit the player from the game
    inputData.client.on("messageDelete", async (deletedMessage) => {
      if (deletedMessage.id == akiMessage.id) {
        notFinished = false;
        games.delete(inputData.author.id);
        attemptingGuess.delete(inputData.guild.id);
        await aki.win();
        return;
      }
    });

    // repeat while the game is not finished
    while (notFinished) {
      if (!notFinished) return;

      stepsSinceLastGuess = stepsSinceLastGuess + 1;

      if (
        ((aki.progress >= 95 &&
          (stepsSinceLastGuess >= 10 || hasGuessed == false)) ||
          aki.currentStep >= 78) &&
        !attemptingGuess.has(inputData.guild.id)
      ) {
        attemptingGuess.add(inputData.guild.id);
        await aki.win();

        stepsSinceLastGuess = 0;
        hasGuessed = true;

        let guessEmbed = new Discord.MessageEmbed()
          .setAuthor(usertag, avatar)
          .setTitle(
            `${`I'm ${Math.round(aki.progress)}% sure your character is...`}`
          )
          .setDescription(
            `**${aki.answers[0].name}**\n${aki.answers[0].description}\n\n${translations.isThisYourCharacter}`
          )
          .addField(
            translations.ranking,
            `**#${aki.answers[0].ranking}**`,
            true
          )
          .addField(translations.noOfQuestions, `**${aki.currentStep}**`, true)
          .setImage(aki.answers[0].absolute_picture_path)
          .setColor("RANDOM");
        await akiMessage.edit({ embeds: [guessEmbed] });
        akiMessage.embeds[0] = guessEmbed;

        await awaitInput(inputData, akiMessage, true, translations).then(
          async (response) => {
            if (response === null) {
              notFinished = false;
              games.delete(inputData.author.id);
              akiMessage.edit({ embeds: [noResEmbed], components: [] });
              return;
            }
            let reply = getButtonReply(response) || response;
            const guessAnswer = reply.toLowerCase();

            attemptingGuess.delete(inputData.guild.id);

            // if they answered yes
            if (
              guessAnswer == "y" ||
              guessAnswer == translations.yes.toLowerCase()
            ) {
              let finishedGameCorrect = new Discord.MessageEmbed()
                .setAuthor(usertag, avatar)
                .setTitle(translations.wellPlayed)
                .setDescription(
                  `**${inputData.author.username}, ${translations.guessedRightOneMoreTime}**`
                )
                .addField(
                  translations.character,
                  `**${aki.answers[0].name}**`,
                  true
                )
                .addField(
                  translations.ranking,
                  `**#${aki.answers[0].ranking}**`,
                  true
                )
                .addField(
                  translations.noOfQuestions,
                  `**${aki.currentStep}**`,
                  true
                )
                .setColor("RANDOM");
              await response.update({
                embeds: [finishedGameCorrect],
                components: [],
              });

              notFinished = false;
              games.delete(inputData.author.id);
              return;

              // otherwise
            } else if (
              guessAnswer == "n" ||
              guessAnswer == translations.no.toLowerCase()
            ) {
              if (aki.currentStep >= 78) {
                let finishedGameDefeated = new Discord.MessageEmbed()
                  .setAuthor(usertag, avatar)
                  .setTitle(`Well Played!`)
                  .setDescription(
                    `**${inputData.author.username}, ${translations.defeated}**`
                  )
                  .setColor("RANDOM");
                await response.update({
                  embeds: [finishedGameDefeated],
                  components: [],
                });
                notFinished = false;
                games.delete(inputData.author.id);
              } else {
                await response.update({ embeds: [guessEmbed], components: [] });

                aki.progress = 50;
              }
            }
          }
        );
      }

      if (!notFinished) return;

      if (aki.currentStep !== 0) {
        let updatedAkiEmbed = new Discord.MessageEmbed()
          .setAuthor(usertag, avatar)
          .setTitle(`${translations.question} ${aki.currentStep + 1}`)
          .setDescription(
            `**${translations.progress}: ${Math.round(aki.progress)}%\n${
              aki.question
            }**`
          )
          .setColor("RANDOM");

        await akiMessage.edit({ embeds: [updatedAkiEmbed] });
        akiMessage.embeds[0] = updatedAkiEmbed;
      }

      await awaitInput(inputData, akiMessage, false, translations).then(
        async (response) => {
          if (response === null) {
            await aki.win();
            notFinished = false;
            games.delete(inputData.author.id);
            return akiMessage.edit({ embeds: [noResEmbed], components: [] });
          }
          let reply = getButtonReply(response) || response;
          const answer = reply.toLowerCase();

          // assign points for the possible answers given
          const answers = {
            y: 0,
            yes: 0,
            n: 1,
            no: 1,
            i: 2,
            idk: 2,
            "dont know": 2,
            "don't know": 2,
            i: 2,
            p: 3,
            probably: 3,
            pn: 4,
            "probably not": 4,
          };

          let thinkingEmbed = new Discord.MessageEmbed()
            .setAuthor(usertag, avatar)
            .setTitle(`${translations.question} ${aki.currentStep + 1}`)
            .setDescription(
              `**${translations.progress}: ${Math.round(aki.progress)}%\n${
                aki.question
              }**`
            )
            .setFooter(translations.thinking)
            .setColor("RANDOM");

          await response.update({ embeds: [thinkingEmbed], components: [] });

          akiMessage.embeds[0] = thinkingEmbed;

          if (answer == "b" || answer == translations.back.toLowerCase()) {
            if (aki.currentStep >= 1) {
              await aki.back();
            }

            // stop the game if the user selected to stop
          } else if (
            answer == "s" ||
            answer == translations.stop.toLowerCase()
          ) {
            games.delete(inputData.author.id);
            let stopEmbed = new Discord.MessageEmbed()
              .setAuthor(usertag, avatar)
              .setTitle(translations.gameEnded)
              .setDescription(
                `**${inputData.author.username}, ${translations.gameForceEnd}**`
              )
              .setColor("RANDOM");
            await aki.win();
            await akiMessage.edit({ embeds: [stopEmbed], components: [] });
            notFinished = false;
          } else {
            await aki.step(answers[answer]);
          }
        }
      );
    }
  } catch (e) {
    // log any errors that come
    attemptingGuess.delete(inputData.guild.id);
    games.delete(inputData.guild.id);
    if (e == "DiscordAPIError: Unknown Message") return;
    else if (e == "DiscordAPIError: Cannot send an empty message")
      return console.log(
        "Discord.js Akinator Error: Discord.js v13 or Higher is Required."
      );
    console.log("Discord.js Akinator Error:");
    console.log(e);
  }
};
