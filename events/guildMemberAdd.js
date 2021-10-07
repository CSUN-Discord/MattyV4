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

    member.client.channels.cache
      .get("468170551135961108")
      .send(`Welcome ${member.user}!`);
    member.client.channels.cache
      .get("468170551135961108")
      .send(
        `To access all channels please use the command **/answerthebot** and wait while a mod lets you in the server.`
      );
  },
};
