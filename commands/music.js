/*
This command will play a song
*/

const axios = require("axios");
const {MessageEmbed, Util, MessageButton, MessageActionRow, MessageSelectMenu} = require("discord.js");
const {client} = require("../index")
let startQueue = 0;
let endQueue = 10;

module.exports = {
    name: "music",
    description: "Music commands supports, Youtube and Spotify songs and playlists.",
    options: [
        {
            name: "play",
            description: "Supports Youtube, Spotify, and Apple.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "query",
                    description: "Song/Playlist name or url.",
                    type: "STRING",
                    required: true,
                }
            ]
        },
        {
            name: "queue",
            description: "Displays the current queue.",
            type: "SUB_COMMAND",
        },
        {
            name: "skip",
            description: "Skips the current song.",
            type: "SUB_COMMAND",
        },
        {
            name: "loop",
            description: "Loop track, queue, or turn it off.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "mode",
                    description: "Loop track, queue, or turn it off.",
                    required: true,
                    type: "STRING",
                    choices: [
                        {
                            name: "track",
                            value: "track"
                        },
                        {
                            name: "queue",
                            value: "queue"
                        },
                        {
                            name: "off",
                            value: "off"
                        }
                    ]
                },
            ]
        },
        {
            name: "lyrics",
            description: "Prints lyrics of current song.",
            type: "SUB_COMMAND",
        },
        {
            name: "pause",
            description: "Pauses the queue.",
            type: "SUB_COMMAND",
        },
        {
            name: "resume",
            description: "Resumes the queue.",
            type: "SUB_COMMAND",
        },
        {
            name: "shuffle",
            description: "Shuffle the queue.",
            type: "SUB_COMMAND",
        },
        {
            name: "np",
            description: "Shows the current song that's playing.",
            type: "SUB_COMMAND",
        },
        {
            name: "set-volume",
            description: "Set the volume.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "volume",
                    description: "Number from 0-100.",
                    type: "INTEGER",
                    required: true
                }
            ]
        },
        {
            name: "seek",
            description: "Seek to a time in the song.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "amount",
                    description: "Seek to number in seconds of the song (70 = 1 min 10 sec).",
                    required: true,
                    type: "INTEGER"
                }
            ]
        },
        {
            name: "jump",
            description: "Jump to this track.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "index",
                    description: "Position of the song in the queue.",
                    required: true,
                    type: "INTEGER"
                }
            ]
        },
        {
            name: "filter",
            description: "Filter to apply.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "filter-type",
                    description: "The type of filter.",
                    required: true,
                    type: "STRING",
                    choices: [
                        {
                            name: "3d",
                            value: "3d"
                        },
                        {
                            name: "bassboost",
                            value: "bassboost"
                        },
                        {
                            name: "echo",
                            value: "echo"
                        },
                        {
                            name: "karaoke",
                            value: "karaoke"
                        },
                        {
                            name: "nightcore",
                            value: "nightcore"
                        },
                        {
                            name: "vaporwave",
                            value: "vaporwave"
                        },
                        {
                            name: "flanger",
                            value: "flanger"
                        },
                        {
                            name: "gate",
                            value: "gate"
                        },
                        {
                            name: "haas",
                            value: "haas"
                        },
                        {
                            name: "reverse",
                            value: "reverse"
                        },
                        {
                            name: "surround",
                            value: "surround"
                        },
                        {
                            name: "mcompand",
                            value: "mcompand"
                        },
                        {
                            name: "phaser",
                            value: "phaser"
                        },
                        {
                            name: "tremolo",
                            value: "tremolo"
                        },
                        {
                            name: "earwax",
                            value: "earwax"
                        },
                        {
                            name: "none",
                            value: "none"
                        },
                    ]
                }
            ]
        },
        {
            name: "toggle-autoplay",
            description: "Autoplay songs after queue finishes.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "switch",
                    description: "Turn on or off autoplay.",
                    required: true,
                    type: "STRING",
                }
            ]
        },
        {
            name: "add-related-song",
            description: "Adds a related song to queue.",
            type: "SUB_COMMAND",
        },
        {
            name: "previous",
            description: "Play the previous song if exists.",
            type: "SUB_COMMAND",
        },
        {
            name: "stop",
            description: "Stop, but don't disconnect the bot.",
            type: "SUB_COMMAND",
        },
        {
            name: "remove",
            description: "Removes track from the queue.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "queue-position",
                    description: "Position of the song in the queue.",
                    required: true,
                    type: "INTEGER"
                },
            ]
        },
    ],
    permission: ["SEND_MESSAGES"],

    /**
     *
     * @param interaction
     * @returns {Promise<void>}
     */
    async execute(interaction) {


        const {options, member, guild, channel} = interaction
        const VoiceChannel = member.voice.channel;

        if (!VoiceChannel)
            return interaction.reply({
                content: "You must be in a voice channel to be able to use the music commands.",
                ephemeral: true
            })

        if (guild.me.voice.channelId && VoiceChannel.id !== guild.me.voice.channelId)
            return interaction.reply({
                content: `I'm already playing music in <#${guild.me.voice.channelId}>.`,
                ephemeral: true
            })
        await interaction.deferReply();
        try {
            const queue = await client.distube.getQueue(VoiceChannel);

            switch (options.getSubcommand()) {
                case "play":
                    await client.distube.playVoiceChannel(VoiceChannel, options.getString("query"), {
                        textChannel: channel,
                        member: member
                    })
                    return interaction.editReply({content: "Request received."})

                case "set-volume":
                    let Volume = options.getInteger("volume");
                    if (Volume > 100) Volume = 100;
                    if (Volume < 0) Volume = 0;

                    client.distube.setVolume(VoiceChannel, Volume);

                    return interaction.editReply({content: `Volume has been set to ${Volume}.`});

                case "queue":
                    if (!queue)
                        return interaction.editReply({content: "There is no queue."});

                    try {
                        const queueMessage = await interaction.followUp({
                            embeds: [createQueueEmbed(queue, startQueue, endQueue)],
                            components: createRows(queue)
                        })

                        const collector = interaction.channel
                            .createMessageComponentCollector({time: 840000, idle: 300000})
                        collector.on('collect', async input => {
                            try {
                                if (input.customId === 'first') {
                                    startQueue = 0;
                                    endQueue = startQueue + 10;
                                } else if (input.customId === 'previous') {
                                    startQueue -= 10;

                                    if (startQueue < 0) {
                                        startQueue = 0;
                                        endQueue = startQueue + 10;
                                    } else
                                        endQueue -= 10;
                                } else if (input.customId === 'next') {
                                    endQueue += 10;
                                    if (endQueue > queue.songs.length) {
                                        endQueue = queue.songs.length;
                                        startQueue = endQueue - 10;
                                    } else
                                        startQueue += 10;
                                } else if (input.customId === 'last') {
                                    startQueue = queue.songs.length - 10;
                                    endQueue = queue.songs.length;
                                } else if (input.customId === 'shuffle') {
                                    if (queue != null) {
                                        queue.shuffle();
                                    }
                                } else if (input.customId === 'play') {
                                    if (queue.paused) {
                                        queue.resume();
                                    }
                                } else if (input.customId === 'pause') {
                                    if (queue.playing) {
                                        await queue.pause();
                                    }
                                } else if (input.customId === 'skip') {
                                    if (queue != null) {
                                        if (queue.songs.length < 2)
                                            queue.skip();
                                    }
                                } else if (input.customId === 'repeatQueue') {
                                    if (queue != null) {
                                        queue.setRepeatMode(2)
                                    }
                                } else if (input.customId === 'repeatTrack') {
                                    if (queue != null) {
                                        queue.setRepeatMode(1)
                                    }
                                } else if (input.customId === 'repeatStop') {
                                    if (queue != null) {
                                        queue.setRepeatMode(0)
                                    }
                                } else {
                                    queue.setVolume(parseInt(input.values[0]));
                                }
                                if (queue == null) return;

                                if (queue.playing || queue.paused) {
                                    await input.update({
                                        embeds: [createQueueEmbed(queue)],
                                        components: createRows(queue)
                                    })
                                } else {
                                    await input.update({
                                        embeds: [createQueueEmbed(queue)],
                                        components: []
                                    })
                                }
                            } catch (e) {
                                // console.log(e)
                            }
                        });
                        collector.on('end', collected => {
                            try {
                                queueMessage.edit({
                                    embeds: [createQueueEmbed(queue, startQueue, endQueue)],
                                    components: []
                                })
                                // collected.get([...collected.keys()][0]).message.edit({embeds: [createQueueEmbed(queue, startQueue, endQueue)], components: []})
                            } catch (e) {
                                // console.log(e)
                            }
                        });

                    } catch (e) {
                        console.log(e)
                        return interaction.followUp("There was a problem with printing the queue.")
                    }
                    break;

                case "skip":
                    if (!queue)
                        return interaction.editReply({content: "There is no queue."});

                    const skippedSong = queue.songs[0];
                    await queue.skip(VoiceChannel);
                    return interaction.editReply({content: `${skippedSong.name} requested by ${skippedSong.user.tag} has been skipped.`});

                case "pause":
                    if (!queue)
                        return interaction.editReply({content: "There is no queue."});
                    await queue.pause(VoiceChannel);
                    return interaction.editReply({content: `${queue.songs[0].name} has been paused.`});

                case "resume":
                    if (!queue)
                        return interaction.editReply({content: "There is no queue."});
                    await queue.resume(VoiceChannel);
                    return interaction.editReply({content: `${queue.songs[0].name} has been resumed.`});

                case "stop":
                    if (!queue)
                        return interaction.editReply({content: "There is no queue."});
                    await queue.stop(VoiceChannel);
                    return interaction.editReply({content: "Music has been stopped and the queue has cleared."});

                case "loop":
                    if (!queue)
                        return interaction.editReply({content: "There is no queue."});

                    const mode = options.getString("mode");
                    switch (mode) {
                        case "track":
                            queue.setRepeatMode(1)
                            return interaction.editReply({content: `Song is looped.`})
                        case "queue":
                            queue.setRepeatMode(2)
                            return interaction.editReply({content: "Queue is looped."})
                        case "off":
                            queue.setRepeatMode(0)
                            return interaction.editReply({content: "Loop is turned off."})
                    }
                    break;

                case "lyrics":
                    if (!queue)
                        return interaction.editReply({content: "There is no queue."});

                    const name = queue.songs[0].name;
                    const url = new URL(`https://some-random-api.ml/lyrics`);
                    url.searchParams.append("title", name);

                    try {
                        const {data} = await axios.get(url.href);

                        const lyrics = data.lyrics;

                        const [first, ...rest] = Util.splitMessage(lyrics);

                        const msg = new MessageEmbed({
                            title: `${data.title} - ${data.author}`,
                            thumbnail: {url: data.thumbnail.genius},
                            description: first,
                        });

                        interaction
                            .editReply({
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
                        await interaction.followUp({content: "Song lyrics not found."});
                        console.log(e);
                    }
                    break;

                case "shuffle":
                    if (!queue)
                        return interaction.editReply({content: "There is no queue."});

                    queue.shuffle();

                    return interaction.editReply({content: "Queue has been shuffled."})

                case "np":
                    if (!queue)
                        return interaction.editReply({content: "There is no queue."});
                    if (!queue.playing && !queue.paused)
                        return interaction.editReply({content: "There is nothing playing."});

                    const currentTime = queue.currentTime;
                    const progress = Math.round((25 * currentTime / queue.songs[0].duration));
                    const emptyProgress = 25 - progress;

                    const progressString = "▬".repeat(progress) + "⚪" + '▬'.repeat(emptyProgress);
                    const times = `${queue.formattedCurrentTime}/${queue.songs[0].formattedDuration}`;

                    const nowPlayingEmbed = new MessageEmbed()
                        .setColor("RANDOM")
                        .setAuthor(queue.songs[0].uploader.name)
                        .setTitle(`Now Playing: ${queue.songs[0].name}`)
                        .setURL(queue.songs[0].url)
                        .setThumbnail(queue.songs[0].thumbnail)
                        .setTimestamp()
                    if (queue.paused)
                        nowPlayingEmbed.setDescription(`⏸ Requested By: ${queue.songs[0].user} (${queue.songs[0].user.tag}) \n${progressString} ${times}`)
                    else
                        nowPlayingEmbed.setDescription(`▶ Requested By: ${queue.songs[0].user} (${queue.songs[0].user.tag}) \n${progressString} ${times}`)

                    return interaction.editReply({embeds: [nowPlayingEmbed]})

                case "jump":
                    if (!queue)
                        return interaction.editReply({content: "There is no queue."});

                    const index = interaction.options.getInteger("index");
                    if (index < 2) {
                        return interaction.editReply({content: `Invalid index, please try again.`})
                    }

                    await queue.jump(index - 1);

                    return interaction.editReply({content: "Queue has been jumped."})

                case "filter":
                    if (!queue)
                        return interaction.editReply({content: "There is no queue."});

                    const filter = options.getString("filter-type");

                    switch (filter) {
                        case "3d":
                            queue.setFilter("3d")
                            break;
                        case "echo":
                            queue.setFilter("echo")
                            break;
                        case "karaoke":
                            queue.setFilter("karaoke")
                            break;
                        case "nightcore":
                            queue.setFilter("nightcore")
                            break;
                        case "vaporwave":
                            queue.setFilter("vaporwave")
                            break;
                        case "flanger":
                            queue.setFilter("flanger")
                            break;
                        case "gate":
                            queue.setFilter("gate")
                            break;
                        case "haas":
                            queue.setFilter("haas")
                            break;
                        case "reverse":
                            queue.setFilter("reverse")
                            break;
                        case "surround":
                            queue.setFilter("surround")
                            break;
                        case "phaser":
                            queue.setFilter("phaser")
                            break;
                        case "tremolo":
                            queue.setFilter("tremolo")
                            break;
                        case "bassboost":
                            queue.setFilter("bassboost")
                            break;
                        case "earwax":
                            queue.setFilter("earwax")
                            break;
                        case "mcompand":
                            queue.setFilter("mcompand")
                            break;
                        case "none":
                            queue.setFilter(false)
                            break
                    }

                    return interaction.editReply({content: `Filter set to ${filter}.`})

                case "toggle-autoplay":
                    if (!queue)
                        return interaction.editReply({content: "There is no queue."});

                    queue.toggleAutoplay();

                    return interaction.editReply({content: `Autoplay has been toggled.`})

                case "add-related-song":
                    if (!queue)
                        return interaction.editReply({content: "There is no queue."});

                    const addedSong = await queue.addRelatedSong();

                    return interaction.editReply({content: `${addedSong.name} has been added to queue.`})

                case "previous":
                    if (!queue)
                        return interaction.editReply({content: "There is no queue."});

                    const previousSong = await queue.previous();

                    return interaction.editReply({content: `${previousSong.name} is now playing.`})

                case "remove":
                    if (!queue)
                        return interaction.editReply({content: "There is no queue."});

                    const queuePosition = interaction.options.getInteger("queue-position");
                    if (queuePosition < 1) {
                        return interaction.editReply({content: `Could not remove that index, please try again.`})
                    }

                    try {
                        const song = queue.songs.splice(queuePosition - 1, 1);

                        if (song.name == null)
                            return interaction.editReply({content: `Could not remove that index, please try again.`})
                        return interaction.editReply({content: `${song.name} added by ${song.user.tag} has been removed from the queue.`})

                    } catch (e) {
                        return interaction.editReply({content: `Could not remove that index, please try again.`})
                    }

                case "seek":
                    if (!queue)
                        return interaction.editReply({content: "There is no queue."});

                    const seekTime = options.getInteger("amount")
                    queue.seek(seekTime);

                    return interaction.editReply({content: `${queue.songs[0].name} has been seeked to ${seekTime}.`})

            }

        } catch
            (e) {
            console.log(e)
            const errorEmbed = new MessageEmbed()
                .setColor("RED")
                .setDescription(`🛑 Alert: ${e}`)

            await interaction.channel.send({embeds: [errorEmbed]})

        }
    }
};

function createQueueEmbed(queue) {

    let nowPlaying;
    let repeating = "";
    let volume = "";

    if (!queue.playing && !queue.paused)
        nowPlaying = "Nothing is being played."
    else {
        const currentTime = queue.currentTime;
        const progress = Math.round((25 * currentTime / queue.songs[0].duration));
        const emptyProgress = 25 - progress;

        const progressString = "▬".repeat(progress) + "⚪" + '▬'.repeat(emptyProgress);
        const times = `${queue.formattedCurrentTime}/${queue.songs[0].formattedDuration}`;

        if (queue.paused)
            nowPlaying = `⏸ [${queue.songs[0].name}](${queue.songs[0].url}) - Requested by: ${queue.songs[0].user} (${queue.songs[0].user.tag})\n${progressString} ${times}`
        else
            nowPlaying = `▶ [${queue.songs[0].name}](${queue.songs[0].url}) - Requested by: ${queue.songs[0].user} (${queue.songs[0].user.tag})\n${progressString} ${times}`
    }

    switch (queue.repeatMode) {
        case 0:
            repeating = `❌`
            break;
        case 1:
            repeating = `🔂`
            break;
        case 2:
            repeating = `🔁`
            break;
    }

    if (queue.volume < 1)
        volume = `🔇`
    else if (queue.volume > 0 && queue.volume < 30)
        volume = `🔈`
    else if (queue.volume > 29 && queue.volume < 60)
        volume = `🔉`
    else if (queue.volume > 59)
        volume = `🔊`

    return new MessageEmbed()
        .setColor("RANDOM")
        .setTitle("Music Queue")
        .addFields(
            {name: 'Now Playing', value: `${nowPlaying}`},
            {name: 'Total Entries', value: `${queue.songs.length}`, inline: true},
            {name: 'Total Queue Duration', value: `${queue.formattedDuration}`, inline: true},
            {name: 'Repeating', value: `${repeating}`, inline: true},
            {name: `${volume}`, value: `${queue.volume}`, inline: true},
        )
        .setTimestamp()
        .setDescription(`${getDescription(queue, startQueue, endQueue)}`);
}

function getDescription(queue) {
    let description = ``;
    for (let i = startQueue; i < endQueue; i++) {
        try {
            description += `${i + 1}) \`\`${queue.songs[i].formattedDuration}\`\` [${queue.songs[i].name}](${queue.songs[i].url}) - ${queue.songs[i].user} (${queue.songs[i].user.tag})\n`
        } catch (e) {
            // console.log(e)
        }
    }
    return description;
}

function createRows(queue) {
    let actionRows = [];

    const buttonRow1 = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setStyle("SECONDARY")
                .setEmoji("⏪")
                .setCustomId("first")
        )
        .addComponents(
            new MessageButton()
                .setStyle("SECONDARY")
                .setEmoji("⬅")
                .setCustomId("previous")
        )
        .addComponents(
            new MessageButton()
                .setStyle("SECONDARY")
                .setEmoji("➡")
                .setCustomId("next")
        )
        .addComponents(
            new MessageButton()
                .setStyle("SECONDARY")
                .setEmoji("⏩")
                .setCustomId("last")
        )

    const buttonRow2 = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setStyle("SECONDARY")
                .setEmoji("🔀")
                .setCustomId("shuffle")
        )

    if (queue.paused) {
        buttonRow2
            .addComponents(
                new MessageButton()
                    .setStyle("SECONDARY")
                    .setEmoji("▶")
                    .setCustomId("play")
            )
    } else {
        buttonRow2
            .addComponents(
                new MessageButton()
                    .setStyle("SECONDARY")
                    .setEmoji("⏸")
                    .setCustomId("pause")
            )
    }
    buttonRow2
        .addComponents(
            new MessageButton()
                .setStyle("SECONDARY")
                .setEmoji("⏭")
                .setCustomId("skip")
        )
    if (queue.repeatMode === 0) {
        buttonRow2
            .addComponents(
                new MessageButton()
                    .setStyle("SECONDARY")
                    .setEmoji("🔁")
                    .setCustomId("repeatQueue")
            )
    } else if (queue.repeatMode === 2) {
        buttonRow2
            .addComponents(
                new MessageButton()
                    .setStyle("SECONDARY")
                    .setEmoji("🔂")
                    .setCustomId("repeatTrack")
            )
    } else if (queue.repeatMode === 1) {
        buttonRow2
            .addComponents(
                new MessageButton()
                    .setStyle("SECONDARY")
                    .setEmoji("🚫")
                    .setCustomId("repeatStop")
            )
    }

    const menuRow1 = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
                .setCustomId('volume')
                .setPlaceholder('Select Volume')
                .addOptions([
                    {
                        label: '0',
                        description: 'Set volume to 0.',
                        value: "0",
                    },
                    {
                        label: '5',
                        description: 'Set volume to 5.',
                        value: "5",
                    },
                    {
                        label: '10',
                        description: 'Set volume to 10.',
                        value: "10",
                    },
                    {
                        label: '15',
                        description: 'Set volume to 15.',
                        value: "15",
                    },
                    {
                        label: '20',
                        description: 'Set volume to 20.',
                        value: "20",
                    },
                    {
                        label: '25',
                        description: 'Set volume to 25.',
                        value: "25",
                    },
                    {
                        label: '30',
                        description: 'Set volume to 30.',
                        value: "30",
                    },
                    {
                        label: '35',
                        description: 'Set volume to 35.',
                        value: "35",
                    },
                    {
                        label: '40',
                        description: 'Set volume to 40.',
                        value: "40",
                    },
                    {
                        label: '45',
                        description: 'Set volume to 45.',
                        value: "45",
                    },
                    {
                        label: '50',
                        description: 'Set volume to 50.',
                        value: "50",
                    },
                    {
                        label: '55',
                        description: 'Set volume to 55.',
                        value: "55",
                    },
                    {
                        label: '60',
                        description: 'Set volume to 60.',
                        value: "60",
                    },
                    {
                        label: '65',
                        description: 'Set volume to 65.',
                        value: "65",
                    },
                    {
                        label: '70',
                        description: 'Set volume to 70.',
                        value: "70",
                    },
                    {
                        label: '75',
                        description: 'Set volume to 75.',
                        value: "75",
                    },
                    {
                        label: '80',
                        description: 'Set volume to 80.',
                        value: "80",
                    },
                    {
                        label: '85',
                        description: 'Set volume to 85.',
                        value: "85",
                    },
                    {
                        label: '90',
                        description: 'Set volume to 90.',
                        value: "90",
                    },
                    {
                        label: '95',
                        description: 'Set volume to 95.',
                        value: "95",
                    },
                    {
                        label: '100',
                        description: 'Set volume to 100.',
                        value: "100",
                    },
                ]),
        )
    actionRows.push(buttonRow1)
    actionRows.push(buttonRow2)
    actionRows.push(menuRow1)

    return actionRows;
}