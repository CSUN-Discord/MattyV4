/*
Challlenge another server member to a connect four game
*/

const Game = require("connect-four");
const { MessageActionRow } = require("discord.js");
const Discord = require("discord.js");
const inGame = new Set();
const games = new Map();

const connectFunctions = require("../db/functions/connectFunctions");

module.exports = {
  name: "connect-4",
  description: "Use to check if bot is active.",
  options: [
    {
      name: "challengee",
      description: "Someone to challenge.",
      type: "USER",
      required: true,
    },
  ],
  permission: ["SEND_MESSAGES"],

  /**
   *
   * @param interaction
   * @returns {Promise<void>}
   */

  async execute(interaction) {
    const challengee = interaction.options.getUser("challengee");
    let gameRunning;
    const gameChannel = interaction.channel;
    let connectEmbedMessage;

    try {
      if (inGame.has(challengee) || inGame.has(interaction.user))
        return await interaction.reply({
          content: `One of you is in a game.`,
          ephemeral: true,
        });
      else if (challengee === interaction.user)
        return await interaction.reply({
          content: `You can't challenge yourself.`,
          ephemeral: true,
        });
      else {
        const challenge = await interaction.channel.send({
          content: `${challengee} do you accept ${interaction.user}'s challenge for a connect-4 game?`,
        });

        let connectEmbed = new Discord.MessageEmbed()
          .setTitle(`${interaction.user.username} vs ${challengee.username}`)
          .setDescription(`**${challengee} Do you accept the challenge?**`)
          .setColor("RANDOM");

        await interaction.channel
          .send({ embeds: [connectEmbed] })
          .then(async (msg) => {
            interaction.reply({ content: "Challenge sent", ephemeral: true });

            await awaitChallengeInput(msg, challengee).then(
              async (response) => {
                if (response === null) {
                  let noReply = new Discord.MessageEmbed()
                    .setTitle(
                      `${interaction.user.username} vs ${challengee.username}`
                    )
                    .setDescription(`**${challengee} Did not respond.**`)
                    .setColor("RANDOM");

                  msg.edit({
                    embeds: [noReply],
                    components: [],
                  });
                  return;
                }
                let challengeReply = getButtonReply(response) || response;
                const challengeAnswer = challengeReply.toLowerCase();

                await challenge.delete();

                if (challengeAnswer === "yes") {
                  gameRunning = true;

                  if (inGame.has(challengee) || inGame.has(interaction.user)) {
                    msg.delete();
                    await gameChannel.send({
                      content: `${interaction.user} or ${challengee} is in a connect-4 game already.`,
                    });
                    gameRunning = false;
                    return;
                  }
                  inGame.add(challengee);
                  inGame.add(interaction.user);

                  let starting = challengee;
                  if (Math.floor(Math.random() * 2) == 0)
                    starting = interaction.user;

                  games.set(interaction.user, {
                    userOne: interaction.user,
                    userTwo: challengee,
                    currentMove: starting,
                    draw: false,
                    game: new Game(),
                  });

                  connectEmbed = new Discord.MessageEmbed()
                    .setTitle(
                      `${games.get(interaction.user).userOne.username} vs ${
                        games.get(interaction.user).userTwo.username
                      }`
                    )
                    .setDescription(
                      `**Turn: ${
                        games.has(challengee)
                          ? games.get(challengee).currentMove
                          : games.get(interaction.user).currentMove
                      }**`
                    )
                    .addField(
                      `**${games.get(interaction.user).userOne.username}: 🔵 ${
                        games.get(interaction.user).userTwo.username
                      }: 🔴 **\n----------------------------------------\n`,
                      printGame(interaction.user)
                    )
                    .setColor("RANDOM");
                  msg.delete();

                  await interaction.channel
                    .send({
                      embeds: [connectEmbed],
                      components: [],
                    })
                    .then((message) => (connectEmbedMessage = message))
                    .catch(console.error);
                } else {
                  let rejectReply = new Discord.MessageEmbed()
                    .setTitle(
                      `${interaction.user.username} vs ${challengee.username}`
                    )
                    .setDescription(
                      `**${challengee} Did not accept your connect-4 challenge.**`
                    )
                    .setColor("RANDOM");

                  await response.update({
                    embeds: [rejectReply],
                    components: [],
                  });
                  return;
                }
              }
            );
            while (gameRunning) {
              if (games.get(interaction.user).game.ended) {
                inGame.delete(games.get(interaction.user).userOne);
                inGame.delete(games.get(interaction.user).userTwo);
                gameRunning = false;

                //someone lost the game or it was a tie

                let currentWinner = games.get(interaction.user).userOne;

                let currentWinnerId = games.get(interaction.user).userOne.id;
                let currentLoserId = games.get(interaction.user).userTwo.id;

                if (games.get(interaction.user).currentMove === currentWinner) {
                  currentWinner = games.get(interaction.user).userTwo;
                  currentWinnerId = games.get(interaction.user).userTwo.id;
                  currentLoserId = games.get(interaction.user).userOne.id;
                }

                if (games.get(interaction.user).game.winner !== null) {
                  await connectFunctions.addWin(currentWinnerId);
                  await connectFunctions.addLoss(currentLoserId);
                }

                if (games.get(interaction.user).game.winner === null) {
                  currentWinner = "Nobody, it was a tie.";
                }

                let endedEmbed = new Discord.MessageEmbed()
                  .setTitle(
                    `${games.get(interaction.user).userOne.username} vs ${
                      games.get(interaction.user).userTwo.username
                    } Has Ended`
                  )
                  .setDescription(`**Winner: ${currentWinner}**`)
                  .addField(
                    `**${games.get(interaction.user).userOne.username}: 🔵 ${
                      games.get(interaction.user).userTwo.username
                    }: 🔴 **\n----------------------------------------\n`,
                    printGame(interaction.user)
                  )
                  .setColor("RANDOM");

                await connectEmbedMessage.delete();

                await interaction.channel
                  .send({
                    embeds: [endedEmbed],
                    components: [],
                  })
                  .then((message) => (connectEmbedMessage = message))
                  .catch(console.error);

                games.delete(interaction.user);

                return;
              }
              const currentMove = games.get(interaction.user).currentMove;

              await awaitInput(connectEmbedMessage, currentMove).then(
                async (response2) => {
                  if (response2 === null) {
                    if (!gameRunning) return;
                    inGame.delete(games.get(interaction.user).userOne);
                    inGame.delete(games.get(interaction.user).userTwo);
                    gameRunning = false;

                    //someone lost due to inactivity

                    let currentWinner = games.get(interaction.user).userOne;

                    let currentWinnerId = games.get(interaction.user).userOne
                      .id;
                    let currentLoserId = games.get(interaction.user).userTwo.id;

                    if (
                      games.get(interaction.user).currentMove === currentWinner
                    ) {
                      currentWinner = games.get(interaction.user).userTwo;
                      currentWinnerId = games.get(interaction.user).userTwo.id;
                      currentLoserId = games.get(interaction.user).userOne.id;
                    }
                    await connectFunctions.addWin(currentWinnerId);
                    await connectFunctions.addLoss(currentLoserId);

                    let noResEmbed = new Discord.MessageEmbed()
                      .setTitle("Game Ended")
                      .setDescription(
                        `**${
                          interaction.user
                        } ${challengee}, the game has ended due to ${
                          games.get(interaction.user).currentMove
                        } not making a move for 1 minute.**`
                      )
                      .addField("Winner:", `${currentWinner}`)
                      .setColor("RANDOM");

                    connectEmbedMessage.edit({
                      embeds: [noResEmbed],
                      components: [],
                    });

                    games.delete(interaction.user);

                    return;
                  }

                  let reply = getButtonReply(response2) || response2;
                  const answer = reply.toLowerCase();

                  // stop the game if the user selected to stop
                  if (answer === "stop") {
                    inGame.delete(games.get(interaction.user).userOne);
                    inGame.delete(games.get(interaction.user).userTwo);
                    gameRunning = false;

                    //someone gave up

                    let currentWinner = games.get(interaction.user).userOne;

                    let currentWinnerId = games.get(interaction.user).userOne
                      .id;
                    let currentLoserId = games.get(interaction.user).userTwo.id;

                    if (
                      games.get(interaction.user).currentMove === currentWinner
                    ) {
                      currentWinner = games.get(interaction.user).userTwo;
                      currentWinnerId = games.get(interaction.user).userTwo.id;
                      currentLoserId = games.get(interaction.user).userOne.id;
                    }
                    await connectFunctions.addWin(currentWinnerId);
                    await connectFunctions.addLoss(currentLoserId);

                    let stopEmbed = new Discord.MessageEmbed()
                      .setTitle("Game Ended")
                      .setDescription(
                        `**${
                          interaction.user
                        } ${challengee}, the game has ended due to ${
                          games.get(interaction.user).currentMove
                        } surrendering.**`
                      )
                      .addField("Winner:", `${currentWinner}`)
                      .setColor("RANDOM");

                    await connectEmbedMessage.edit({
                      embeds: [stopEmbed],
                      components: [],
                    });

                    games.delete(interaction.user);

                    return;
                  } else {
                    if (
                      games
                        .get(interaction.user)
                        .game.validMove(parseInt(answer) - 1)
                    ) {
                      games
                        .get(interaction.user)
                        .game.play(
                          games.get(interaction.user).currentMove,
                          parseInt(answer) - 1
                        );

                      if (
                        games.get(interaction.user).currentMove ===
                        games.get(interaction.user).userOne
                      )
                        games.get(interaction.user).currentMove = games.get(
                          interaction.user
                        ).userTwo;
                      else
                        games.get(interaction.user).currentMove = games.get(
                          interaction.user
                        ).userOne;

                      let connectEmbedUpdate = new Discord.MessageEmbed()
                        .setTitle(
                          `${games.get(interaction.user).userOne.username} vs ${
                            games.get(interaction.user).userTwo.username
                          }`
                        )
                        .setDescription(
                          `**Turn: ${
                            games.has(challengee)
                              ? games.get(challengee).currentMove
                              : games.get(interaction.user).currentMove
                          }**`
                        )
                        .addField(
                          `**${
                            games.get(interaction.user).userOne.username
                          }: 🔵 ${
                            games.get(interaction.user).userTwo.username
                          }: 🔴 **\n----------------------------------------\n`,
                          printGame(interaction.user)
                        )
                        .setColor("RANDOM");

                      await connectEmbedMessage.delete();

                      await interaction.channel
                        .send({
                          embeds: [connectEmbedUpdate],
                          components: [],
                        })
                        .then((message) => (connectEmbedMessage = message))
                        .catch(console.error);
                    }
                  }
                }
              );
            }
          });
      }
    } catch (e) {
      console.log(e);
    }
  },
};

function getButtonReply(interaction) {
  interaction = interaction.customId;

  if (interaction === "1️⃣") {
    //one
    return "1";
  } else if (interaction === "2️⃣") {
    //two
    return "2";
  } else if (interaction === "3️⃣") {
    //three
    return "3";
  } else if (interaction === "4️⃣") {
    //four
    return "4";
  } else if (interaction === "5️⃣") {
    //five
    return "5";
  } else if (interaction === "6️⃣") {
    //six
    return "6";
  } else if (interaction === "7️⃣") {
    //seven
    return "7";
  } else if (interaction === "🛑") {
    //stop game
    return "stop";
  } else if (interaction === "✔") {
    //accept the challenge
    return "yes";
  } else if (interaction === "✖") {
    //deny the challenge
    return "no";
  } else return null;
}

async function awaitInput(botMessage, currentMove) {
  let one = new Discord.MessageButton()
    .setLabel("one")
    .setStyle("SECONDARY")
    .setEmoji("1️⃣")
    .setCustomId("1️⃣");

  let two = new Discord.MessageButton()
    .setLabel("two")
    .setStyle("SECONDARY")
    .setEmoji("2️⃣")
    .setCustomId("2️⃣");

  let three = new Discord.MessageButton()
    .setLabel("three")
    .setStyle("SECONDARY")
    .setEmoji("3️⃣")
    .setCustomId("3️⃣");

  let four = new Discord.MessageButton()
    .setLabel("four")
    .setStyle("SECONDARY")
    .setEmoji("4️⃣")
    .setCustomId("4️⃣");

  let five = new Discord.MessageButton()
    .setLabel("five")
    .setStyle("SECONDARY")
    .setEmoji("5️⃣")
    .setCustomId("5️⃣");

  let six = new Discord.MessageButton()
    .setLabel("six")
    .setStyle("SECONDARY")
    .setEmoji("6️⃣")
    .setCustomId("6️⃣");

  let seven = new Discord.MessageButton()
    .setLabel("seven")
    .setStyle("SECONDARY")
    .setEmoji("7️⃣")
    .setCustomId("7️⃣");

  let surrender = new Discord.MessageButton()
    .setLabel("surrender")
    .setStyle("DANGER")
    .setEmoji("🛑")
    .setCustomId("🛑");

  let answerTypes = [one, two, three, four, five, six, seven, surrender];

  let choice = await buttonMenuTwo(botMessage, answerTypes, currentMove, 60000);
  if (!choice) return null;
  else return choice;
}

async function awaitChallengeInput(challengeMsg, challengee) {
  let yes = new Discord.MessageButton()
    .setLabel("yes")
    .setStyle("SUCCESS")
    .setEmoji("✔")
    .setCustomId("✔");

  let no = new Discord.MessageButton()
    .setLabel("no")
    .setStyle("DANGER")
    .setEmoji("✖")
    .setCustomId("✖");

  let answerTypes = [yes, no];

  let choice = await buttonMenu(challengeMsg, answerTypes, challengee, 60000);
  if (!choice) return null;
  else return choice;
}

async function buttonMenu(botMessage, buttons, currentMove, time) {
  //check all our params exist
  if (!botMessage)
    return console.log("Button Menu Error: No Bot Message Provided!");
  if (!buttons) return console.log("Button Menu Error: No Buttons Provided!");
  if (!time) return console.log("Button Menu Error: No Time Provided!");

  let buttonRow = new MessageActionRow();
  let buttonRows = [];

  for (let i = 0; i < buttons.length; i++) {
    buttonRow.addComponents(buttons[i]);
  }

  buttonRows.push(buttonRow);

  botMessage = await botMessage.edit({
    embeds: [botMessage.embeds[0]],
    components: buttonRows,
  });

  const filter = (i) => i.user == currentMove.id;

  let selection;

  await botMessage.channel
    .awaitMessageComponent({
      filter: filter,
      time: time,
      componentType: "BUTTON",
    })
    .then(async (i) => {
      selection = i;
    })
    .catch(() => {
      // do nothing
    });

  return selection;
}

async function buttonMenuTwo(botMessage, buttons, currentMove, time) {
  //check all our params exist
  if (!botMessage)
    return console.log("Button Menu Error: No Bot Message Provided!");
  if (!buttons) return console.log("Button Menu Error: No Buttons Provided!");
  if (!time) return console.log("Button Menu Error: No Time Provided!");

  let buttonRow = new MessageActionRow();
  let buttonRow2 = new MessageActionRow();
  let buttonRow3 = new MessageActionRow();
  let buttonRows = [];

  for (let i = 0; i < 4; i++) {
    buttonRow.addComponents(buttons[i]);
  }

  for (let i = 4; i < 7; i++) {
    buttonRow2.addComponents(buttons[i]);
  }

  buttonRow3.addComponents(buttons[7]);

  buttonRows.push(buttonRow);
  if (buttons.length >= 5) buttonRows.push(buttonRow2);
  if (buttons.length >= 7) buttonRows.push(buttonRow3);

  botMessage = await botMessage.edit({
    embeds: [botMessage.embeds[0]],
    components: buttonRows,
  });

  const filter = (i) => i.user == currentMove.id;

  let selection;

  await botMessage.channel
    .awaitMessageComponent({
      filter: filter,
      time: time,
      componentType: "BUTTON",
    })
    .then(async (i) => {
      selection = i;
    })
    .catch(() => {
      // do nothing
    });

  return selection;
}

//double for loop to print out the 2d array
function printGame(index) {
  let string = ``;

  for (let i = 5; i > -1; i--) {
    string += "| ";
    for (let j = 0; j < 7; j++) {
      if (games.get(index).game.get(j, i) === games.get(index).userOne)
        string += "🔵 ";
      else if (games.get(index).game.get(j, i) === games.get(index).userTwo)
        string += "🔴 ";
      else string += "⚪ ";
    }
    string += " |\n";
  }
  string += "----------------------------------------";

  return string;
}
