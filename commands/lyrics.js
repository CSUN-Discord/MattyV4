/*
This command will return the lyrics of a song
*/

const { SlashCommandBuilder } = require("@discordjs/builders");
const Genius = require("genius-lyrics");
const ACCESS_TOKEN =
  "7R8YkN3OmB0eBcH6AniWDTUUk7HdX8nhIkjkyIK6DFhaBl7aqzIqyGnuLvaH-Utl";
const geniusClient = new Genius.Client(ACCESS_TOKEN);
const { Util } = require("discord.js");

module.exports = {
  ...new SlashCommandBuilder()
    .setName("lyrics")
    .setDescription("Gives the lyrics of a song from Genius.com.")
    .addStringOption((option) =>
      option.setName("song").setDescription("Song name.").setRequired(true)
    ),

  permission: ["SEND_MESSAGES"],
  cooldown: 5,

  /**
   *
   * @param interaction
   * @returns {Promise<void>}
   */
  async execute(interaction) {
    const songName = interaction.options.getString("song");

    try {
      //search for the lyrics on genius using the song name

      const searches = await geniusClient.songs.search(songName);
      const firstSong = searches[0];
      const lyrics = await firstSong.lyrics();

      const [first, ...rest] = Util.splitMessage(lyrics);

      await interaction.reply({
        content: first,
      });

      // Max characters were reached so send the rest of the lyrics
      if (rest.length) {
        for (const text of rest) {
          // send the rest of the lyrics
          await interaction.followUp({
            content: text,
          });
        }
      }
    } catch (error) {
      console.log(error);
      await interaction.reply({
        content: "Can't find song lyrics.",
      });
    }
  },
};
