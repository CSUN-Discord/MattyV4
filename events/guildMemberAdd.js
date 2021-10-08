/*
event that listens for new members
 */

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

    member.client.channels.cache.get("496834947894476810").send(
      `Welcome ${member.user}! \n To access all channels please use the command **/answer-the-bot** and wait while 
        someone from the mod team lets you in the server.`
    );
  },
};
