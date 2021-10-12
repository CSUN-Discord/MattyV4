/*
This command will return the lyrics of a song
*/

const axios = require("axios");
const { MessageEmbed, Util } = require("discord.js");
module.exports = {
  name: "lyrics",
  description: "Gives the lyrics of a song from Genius.com.",
  options: [
    {
      name: "song",
      description: "Song name.",
      type: "STRING",
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
    await interaction.deferReply();
    const songName = interaction.options.getString("song");

    const url = new URL(`https://some-random-api.ml/lyrics`);
    url.searchParams.append("title", songName);

    try {
      const { data } = await axios.get(url.href);

      const lyrics = data.lyrics;

      const [first, ...rest] = Util.splitMessage(lyrics);

      const msg = new MessageEmbed({
        title: `${data.title} - ${data.author}`,
        thumbnail: { url: data.thumbnail.genius },
        description: first,
      });

      interaction
        .followUp({
          embeds: [msg],
        })
        .then((r) => {
          // Max characters were reached so send the rest of the lyrics
          if (rest.length) {
            for (const text of rest) {
              // send the rest of the lyrics
              const msg = new MessageEmbed({
                description: text,
              });
              interaction.followUp({
                embeds: [msg],
              });
            }
          }
        });
    } catch (e) {
      await interaction.followUp({ content: "Song lyrics not found." });
      console.log(e);
    }
  },
};
