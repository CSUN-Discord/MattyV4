/*
event that listens for new members
 */

const { welcomeChannelId } = require("../validation/channels.json");

module.exports = {
  name: "guildMemberAdd",

  /**
   *
   * @param member
   * @returns {Promise<void>}
   */
  async execute(member) {
    member.roles.add(
      member.guild.roles.cache.find((role) => role.name === "AnswerTheBot")
    );

    member.client.channels.cache.get(welcomeChannelId).send(
      `Welcome ${member.user}! \n To access all channels please use the command **/answer-the-bot** and wait while 
        someone from the mod team lets you in the server.`
    );
  },
};
