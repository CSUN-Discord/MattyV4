/*
this command will give out roles based on reactions
*/

const { roleChangeChannelId } = require("../validation/channels.json");
const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "role",
  description: "Sends an embed in the role channel.",
  permission: ["ADMINISTRATOR"],

  /**
   *
   * @param interaction
   * @returns {Promise<void>}
   */
  async execute(interaction) {
    interaction.reply({
      content: "Message sent.",
      ephemeral: true,
    });

    const specialNitroOverride = interaction.guild.roles.cache.find(
      (r) => r.id === "618873854902796289"
    );
    const masterNitroOverride = interaction.guild.roles.cache.find(
      (r) => r.id === "784680058320060456"
    );
    const alumniNitroOverride = interaction.guild.roles.cache.find(
      (r) => r.id === "753472930113126540"
    );
    const seniorNitroOverride = interaction.guild.roles.cache.find(
      (r) => r.id === "643726356655374366"
    );
    const juniorNitroOverride = interaction.guild.roles.cache.find(
      (r) => r.id === "631006736488202260"
    );
    const sophomoreNitroOverride = interaction.guild.roles.cache.find(
      (r) => r.id === "631007371363221504"
    );
    const freshmanNitroOverride = interaction.guild.roles.cache.find(
      (r) => r.id === "614987787833311233"
    );
    const cumLord = interaction.guild.roles.cache.find(
      (r) => r.id === "801964091715485727"
    );
    const santa = interaction.guild.roles.cache.find(
      (r) => r.id === "641445890527330334"
    );
    const faculty = interaction.guild.roles.cache.find(
      (r) => r.id === "699053783610818620"
    );
    const csunEmployee = interaction.guild.roles.cache.find(
      (r) => r.id === "480434826034413568"
    );
    const nitroDonators = interaction.guild.roles.cache.find(
      (r) => r.id === "630985778930909204"
    );
    const iAmLecturer = interaction.guild.roles.cache.find(
      (r) => r.id === "836916558264664064"
    );
    const study = interaction.guild.roles.cache.find(
      (r) => r.id === "682791449003032578"
    );

    const requestEmbed = new MessageEmbed()
      .setTitle(
        "If you qualify for one of these roles ping someone from he mod team." +
          "\nIf your desired role isn't shown here or the bottom message " +
          "then you probably cant get it. 😭"
      )
      .setColor("RANDOM")
      .setDescription(
        `
        ${specialNitroOverride} - If you have the special role and want to override your pink nitro color. \n
        ${masterNitroOverride} - If you are a masters student and want to override your pink nitro color. \n
        ${alumniNitroOverride} - If you are a Alumni and want to override your pink nitro color. \n
        ${seniorNitroOverride} - If you are a senior and want to override your pink nitro color. \n
        ${juniorNitroOverride} - If you are a junior and want to override your pink nitro color. \n
        ${sophomoreNitroOverride} - If you are a sophomore and want to override your pink nitro color. \n
        ${freshmanNitroOverride} - If you are a freshman and want to override your pink nitro color. \n
        ${cumLord} - If you reached the GPA standard. \n
        ${santa} - If you have given gifts during Christmas time. \n
        ${faculty} - If you are a faculty. \n
        ${csunEmployee} - If you are an employee of Erika D. Beck. \n
        ${nitroDonators} - If you have donated nitro to anyone. \n
        ${iAmLecturer} - If you are a lecturer. \n
        ${study} - If you want to remove yourself from all the channels to study for a while. \n
        
        `
      );

    interaction.client.channels.cache
      .get(roleChangeChannelId)
      .send({ embeds: [requestEmbed] });

    const resident = interaction.guild.roles.cache.find(
      (r) => r.id === "491747936435306526"
    );
    const meetups = interaction.guild.roles.cache.find(
      (r) => r.id === "601273275016019978"
    );
    const minecraft = interaction.guild.roles.cache.find(
      (r) => r.id === "694775549196763177"
    );
    const koreaboo = interaction.guild.roles.cache.find(
      (r) => r.id === "755254996995538995"
    );
    const lecture = interaction.guild.roles.cache.find(
      (r) => r.id === "811796493622050826"
    );
    const templeFollower = interaction.guild.roles.cache.find(
      (r) => r.id === "859649594815807489"
    );
    const movie = interaction.guild.roles.cache.find(
      (r) => r.id === "726280155190001735"
    );

    const reactEmbed = new MessageEmbed()
      .setTitle("React below for various roles:")
      .setColor("RANDOM")
      .setDescription(
        `
        If you are fine with being pinged for events regarding these roles then react below.
        ${resident} - 1️⃣ If you want to be notified for resident activities. \n
        ${meetups} - 2️⃣ If you want to be notified for meetups. \n
        ${minecraft} - 3️⃣ If you play minecraft. \n
        ${koreaboo} - 4️⃣ If you are into Korean culture. \n
        ${lecture} - 5️⃣ If you want to know when in-house lectures are starting. \n
        ${templeFollower} - 6️⃣ If you want to know when a temple session is starting. \n
        ${movie} - 7️⃣ If you want to know when movie night is starting. \n
        `
      );

    interaction.client.channels.cache
      .get(roleChangeChannelId)
      .send({ embeds: [reactEmbed] })
      .then((msg) => {
        msg.react(`1️⃣`);
        msg.react(`2️⃣`);
        msg.react(`3️⃣`);
        msg.react(`4️⃣`);
        msg.react(`5️⃣`);
        msg.react(`6️⃣`);
        msg.react(`7️⃣`);
      });

    interaction.client.channels.cache
      .get(roleChangeChannelId)
      .send(
        "If you want to update your school year then use the command: ```/update-year``` \n" +
          "If you want to receive the birthday role on your birthday then use the command: ```/birthday add```"
      );

    // interaction.client.on(`messageReactionAdd`, async (reaction, user) => {
      // if (reaction.message.partial) await reaction.message.fetch();
      // if (reaction.partial) await reaction.fetch();
      // if (user.bot) return;
      // if (!reaction.message.guild) return;
      //
      // if (reaction.message.channel.id === roleChangeChannelId) {
      //   if (reaction.emoji.name === `1️⃣`) {
      //     await reaction.message.guild.members.cache
      //       .get(user.id)
      //       .roles.add(resident);
      //   } else if (reaction.emoji.name === `2️⃣`) {
      //     await reaction.message.guild.members.cache
      //       .get(user.id)
      //       .roles.add(meetups);
      //   } else if (reaction.emoji.name === `3️⃣`) {
      //     await reaction.message.guild.members.cache
      //       .get(user.id)
      //       .roles.add(minecraft);
      //   } else if (reaction.emoji.name === `4️⃣`) {
      //     await reaction.message.guild.members.cache
      //       .get(user.id)
      //       .roles.add(koreaboo);
      //   } else if (reaction.emoji.name === `5️⃣`) {
      //     await reaction.message.guild.members.cache
      //       .get(user.id)
      //       .roles.add(lecture);
      //   } else if (reaction.emoji.name === `6️⃣`) {
      //     await reaction.message.guild.members.cache
      //       .get(user.id)
      //       .roles.add(templeFollower);
      //   } else if (reaction.emoji.name === `7️⃣`) {
      //     await reaction.message.guild.members.cache
      //       .get(user.id)
      //       .roles.add(movie);
      //   }
      // }
    // });

    // interaction.client.on(`messageReactionRemove`, async (reaction, user) => {
    //   if (reaction.message.partial) await reaction.message.fetch();
    //   if (reaction.partial) await reaction.fetch();
    //   if (user.bot) return;
    //   if (!reaction.message.guild) return;
    //
    //   if (reaction.message.channel.id === roleChangeChannelId) {
    //     if (reaction.emoji.name === `1️⃣`) {
    //       await reaction.message.guild.members.cache
    //         .get(user.id)
    //         .roles.remove(resident);
    //     } else if (reaction.emoji.name === `2️⃣`) {
    //       await reaction.message.guild.members.cache
    //         .get(user.id)
    //         .roles.remove(meetups);
    //     } else if (reaction.emoji.name === `3️⃣`) {
    //       await reaction.message.guild.members.cache
    //         .get(user.id)
    //         .roles.remove(minecraft);
    //     } else if (reaction.emoji.name === `4️⃣`) {
    //       await reaction.message.guild.members.cache
    //         .get(user.id)
    //         .roles.remove(koreaboo);
    //     } else if (reaction.emoji.name === `5️⃣`) {
    //       await reaction.message.guild.members.cache
    //         .get(user.id)
    //         .roles.remove(lecture);
    //     } else if (reaction.emoji.name === `6️⃣`) {
    //       await reaction.message.guild.members.cache
    //         .get(user.id)
    //         .roles.remove(templeFollower);
    //     } else if (reaction.emoji.name === `7️⃣`) {
    //       await reaction.message.guild.members.cache
    //         .get(user.id)
    //         .roles.remove(movie);
    //     }
    //   }
    // });
  },
};
