const moviesSchema = require("../schemas/moviesSchema");
const { MessageEmbed } = require("discord.js");
const { Util } = require("discord.js");
let movies = [];
let moviesListEmbedMessage;

module.exports = {
  getAllMovies: function (interaction) {
    try {
      moviesSchema.find({}, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          if (data.length < 1) {
            interaction
              .editReply({
                content: "No movies saved.",
                ephemeral: true,
              })
              .then((r) => {});
          } else {
            interaction
              .editReply({
                content: "All movies currently saved:",
                ephemeral: true,
              })
              .then((r) => {
                const combined = data
                  .map(function (elem) {
                    return elem.name;
                  })
                  .join("\n");
                const [first, ...rest] = Util.splitMessage(combined);

                interaction
                  .followUp({
                    content: first,
                  })
                  .then((r) => {
                    // Max characters were reached so send the rest of the movies
                    if (rest.length) {
                      for (const text of rest) {
                        // send the rest of the movies
                        interaction.followUp({
                          content: text,
                        });
                      }
                    }
                  });
              });
          }
        }
      });
    } catch (e) {}
  },

  getOneMovie: function (interaction, movieName) {
    try {
      moviesSchema.find(
        { name: { $regex: new RegExp(movieName, "i") } },
        (err, data) => {
          if (err) {
            console.log(err);
          } else {
            if (data.length < 1) {
              interaction
                .editReply({
                  content: `${movieName} is not saved in the database.`,
                  ephemeral: true,
                })
                .then((r) => {});
            } else {
              interaction
                .editReply({
                  content: `${movieName} saved in the database.`,
                  ephemeral: true,
                })
                .then((r) => {});
            }
          }
        }
      );
    } catch (e) {}
  },

  getRandomMovie: function (interaction) {
    try {
      movies = [];
      // Get the count of all movies
      moviesSchema.count().exec(function (err, documentCount) {
        if (err) console.log(err);
        else {
          if (documentCount < 1) {
            interaction
              .editReply({
                content: "No movies in the database.",
                ephemeral: true,
              })
              .then((r) => {});
          } else if (documentCount < 10) {
            //get all movies
            moviesSchema.find({}, (err, data) => {
              if (err) console.log(err);
              else {
                for (let movie of data) {
                  movies.push(movie.name);
                }
                const movieListEmbed = new MessageEmbed()
                  .setTitle("Movies List:")
                  .setColor("RANDOM")
                  .addFields({
                    name: "Vote down below for this week's movie.",
                    value: moviesList(),
                  });
                interaction
                  .editReply({
                    embeds: [movieListEmbed],
                  })
                  .then((msg) => {
                    moviesListEmbedMessage = msg;
                    if (movies.length > 0) msg.react("1⃣");
                    if (movies.length > 1) msg.react("2⃣");
                    if (movies.length > 2) msg.react("3⃣");
                    if (movies.length > 3) msg.react("4⃣");
                    if (movies.length > 4) msg.react("5⃣");
                    if (movies.length > 5) msg.react("6⃣");
                    if (movies.length > 6) msg.react("7⃣");
                    if (movies.length > 7) msg.react("8⃣");
                    if (movies.length > 8) msg.react("9⃣");
                    if (movies.length > 9) msg.react("🔟");
                  });
              }
            });
          } else {
            //get 10 movies
            moviesSchema.find({}, (err, data) => {
              if (err) console.log(err);
              else {
                const nums = new Set();
                while (nums.size !== 10) {
                  nums.add(Math.floor(Math.random() * documentCount) + 1);
                }
                for (let number of nums) {
                  movies.push(data[number].name);
                }
                const movieListEmbed = new MessageEmbed()
                  .setTitle("Movies List:")
                  .setColor("RANDOM")
                  .addFields({
                    name: "Vote down below for this week's movie.",
                    value: moviesList(),
                  });
                interaction
                  .editReply({
                    embeds: [movieListEmbed],
                  })
                  .then((msg) => {
                    moviesListEmbedMessage = msg;
                    msg.react("1⃣");
                    msg.react("2⃣");
                    msg.react("3⃣");
                    msg.react("4⃣");
                    msg.react("5⃣");
                    msg.react("6⃣");
                    msg.react("7⃣");
                    msg.react("8⃣");
                    msg.react("9⃣");
                    msg.react("🔟");
                  });
              }
            });
          }
        }
      });
    } catch (e) {
      console.log(e);
    }
  },

  removeMovieList: function (interaction, movieName) {
    try {
      const index = movies.findIndex(
        (movie) => movieName.toLowerCase() === movie.toLowerCase()
      );
      if (index > -1) {
        movies.splice(index, 1);
        const movieListEmbed = new MessageEmbed()
          .setTitle("Movies List:")
          .setColor("RANDOM")
          .addFields({
            name: "Vote down below for this week's movie.",
            value: moviesList(),
          });
        moviesListEmbedMessage
          .edit({ embeds: [movieListEmbed] })
          .then((msg) => {
            msg.reactions.removeAll();
            moviesListEmbedMessage = msg;
            if (movies.length > 0) msg.react("1⃣");
            if (movies.length > 1) msg.react("2⃣");
            if (movies.length > 2) msg.react("3⃣");
            if (movies.length > 3) msg.react("4⃣");
            if (movies.length > 4) msg.react("5⃣");
            if (movies.length > 5) msg.react("6⃣");
            if (movies.length > 6) msg.react("7⃣");
            if (movies.length > 7) msg.react("8⃣");
            if (movies.length > 8) msg.react("9⃣");
            if (movies.length > 9) msg.react("🔟");
          });
        interaction
          .editReply({
            content: `${movieName} is removed from the list.`,
            ephemeral: true,
          })
          .then((r) => {});
      } else {
        interaction
          .editReply({
            content: `${movieName} is not in the current list.`,
            ephemeral: true,
          })
          .then((r) => {});
      }
    } catch (e) {
      console.log(e);
    }
  },

  removeMovieDatabase: function (interaction, movieName) {
    try {
      moviesSchema.findOneAndDelete(
        {
          name: movieName,
        },
        (err, data) => {
          if (err) {
            console.log(err);
          } else {
            if (data)
              interaction
                .editReply({
                  content: "Movie deleted from database.",
                  ephemeral: true,
                })
                .then((r) => {});
            else
              interaction
                .editReply({
                  content: "Movie not found in the database.",
                  ephemeral: true,
                })
                .then((r) => {});
          }
        }
      );
    } catch (e) {}
  },

  addMovieDatabase: async function (movieName) {
    try {
      await moviesSchema
        .findOneAndUpdate(
          {
            name: movieName,
          },
          {},
          {
            upsert: true,
          }
        )
        .exec();
    } catch (e) {
      console.log(e);
    }
  },

  addMovieList: function (interaction, movieName) {
    try {
      if (moviesListEmbedMessage == null)
        interaction
          .editReply({
            content: "Movie list needs to be created first.",
            ephemeral: true,
          })
          .then((r) => {});
      else if (movies.length < 10) {
        movies.push(movieName);

        const movieListEmbed = new MessageEmbed()
          .setTitle("Movies List:")
          .setColor("RANDOM")
          .addFields({
            name: "Vote down below for this week's movie.",
            value: moviesList(),
          });
        moviesListEmbedMessage
          .edit({ embeds: [movieListEmbed] })
          .then((msg) => {
            msg.reactions.removeAll();
            moviesListEmbedMessage = msg;
            if (movies.length > 0) msg.react("1⃣");
            if (movies.length > 1) msg.react("2⃣");
            if (movies.length > 2) msg.react("3⃣");
            if (movies.length > 3) msg.react("4⃣");
            if (movies.length > 4) msg.react("5⃣");
            if (movies.length > 5) msg.react("6⃣");
            if (movies.length > 6) msg.react("7⃣");
            if (movies.length > 7) msg.react("8⃣");
            if (movies.length > 8) msg.react("9⃣");
            if (movies.length > 9) msg.react("🔟");
          });

        interaction
          .editReply({
            content: `${movieName} has been added to the list.`,
            ephemeral: true,
          })
          .then((r) => {});
      } else {
        interaction
          .editReply({
            content: "Movie list already has 10 movies in it.",
            ephemeral: true,
          })
          .then((r) => {});
      }
    } catch (e) {
      console.log(e);
    }
  },
};

function moviesList() {
  if (movies.length < 1) return "No movies in the list.";
  let list = "";
  for (let i = 0; i < movies.length; i++) {
    list += `${i + 1}) ${movies[i]} \n`;
  }
  return list;
}
