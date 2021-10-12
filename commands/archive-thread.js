/*
This command will archive a thread
*/

module.exports = {
  name: "archive-thread",
  description: "Used to delete a thread",
  permission: ["SEND_MESSAGES"],
  options: [
    {
      name: "thread-id",
      description: "ID of the thread.",
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
    const id = interaction.options.getString("thread-id");
    const thread = interaction.channel.threads.cache.find((x) => x.id === id);
    if (thread) {
      await thread.setArchived(true);
      await interaction.reply("Thread archived.");
    } else await interaction.reply("Thread not found.");
  },
};
