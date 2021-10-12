/*
event that happens whenever a thread is created or when the client user is added to a thread
 */

module.exports = {
  name: "threadCreate",
  once: true,

  /**
   *
   * @param thread
   * @returns {Promise<void>}
   */

  async execute(thread) {
    await thread.setLocked(true);
  },
};
