/*
This command will delete a thread
*/

module.exports = {
  name: "deletethread",
  description: "Used to delete a thread",
  permission: ["SEND_MESSAGES"],
  options: [
    {
      name: "thread",
      description: "Name of the thread.",
      required: true,
      type: "STRING",
    },
  ],

  /**
   *
   * @param interaction
   * @returns {Promise<void>}
   */
  async execute(interaction) {
    const title = interaction.options.getString("thread");
    const thread = interaction.channel.threads.cache.find(
      (x) => x.name === title
    );
    if (thread) {
      await thread.delete();
      await interaction.reply("Thread deleted.");
    } else await interaction.reply("Problem while deleting thread.");
  },
};
