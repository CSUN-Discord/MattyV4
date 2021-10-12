/*
This command list 10 movies in planned meetups
remove a chosen movie from the database
add to the vote list
remove from the vote list
and give the imdb result
*/

const movieFunctions = require("../db/functions/moviesFunctions");

module.exports = {
  name: "movies",
  description: "Movie commands.",
  permission: ["SEND_MESSAGES"],
  options: [
    {
      name: "add",
      description: "Adds a movie to the list or database.",
      required: false,
      type: "SUB_COMMAND",
      options: [
        {
          name: "location",
          description: "Add movie to the current list or database.",
          type: "STRING",
          required: true,
          choices: [
            {
              name: "list",
              value: "list",
            },
            {
              name: "database",
              value: "database",
            },
          ],
        },
        {
          name: "name",
          description: "Movie name.",
          type: "STRING",
          required: true,
        },
      ],
    },
    {
      name: "remove",
      description: "Removes a movie from the list or database.",
      required: false,
      type: "SUB_COMMAND",
      options: [
        {
          name: "location",
          description: "Add movie to the current list or database.",
          type: "STRING",
          required: true,
          choices: [
            {
              name: "list",
              value: "list",
            },
            {
              name: "database",
              value: "database",
            },
          ],
        },
        {
          name: "name",
          description: "Movie name.",
          type: "STRING",
          required: true,
        },
      ],
    },
    {
      name: "print",
      description: "List all movies in the database.",
      type: "SUB_COMMAND",
    },
    {
      name: "list",
      description: "List 10 movies to be voted on.",
      type: "SUB_COMMAND",
    },
    {
      name: "check",
      description: "Check if a movie is in the database.",
      type: "SUB_COMMAND",
      options: [
        {
          name: "name",
          description: "Movie name to check the database with.",
          required: true,
          type: "STRING",
        },
      ],
    },
  ],

  /**
   *
   * @param interaction
   * @returns {Promise<void>}
   */
  async execute(interaction) {
    await interaction.deferReply();

    const movieName = interaction.options.getString("name");
    const location = interaction.options.getString("location");

    if (interaction.options.getSubcommand() === "add") {
      if (location === "list") {
        movieFunctions.addMovieList(interaction, movieName);
      } else {
        await movieFunctions.addMovieDatabase(movieName);
        interaction
          .editReply({
            content: "Movie added to the database.",
            ephemeral: true,
          })
          .then((r) => {});
      }
    } else if (interaction.options.getSubcommand() === "remove") {
      if (
        interaction.member.roles.cache.some((role) => role.name === "Mod") ||
        interaction.member.roles.cache.some(
          (role) => role.name === "Helpers"
        ) ||
        interaction.member.roles.cache.some((role) => role.name === "Admin")
      ) {
        if (location === "list") {
          movieFunctions.removeMovieList(interaction, movieName);
        } else {
          movieFunctions.removeMovieDatabase(interaction, movieName);
        }
      } else
        await interaction.editReply({
          content: `Message someone from the mod team to remove a movie.`,
          ephemeral: true,
        });
    } else if (interaction.options.getSubcommand() === "print") {
      movieFunctions.getAllMovies(interaction);
    } else if (interaction.options.getSubcommand() === "list") {
      movieFunctions.getRandomMovie(interaction);
    } else if (interaction.options.getSubcommand() === "check") {
      movieFunctions.getOneMovie(interaction, movieName);
    }
  },
};
