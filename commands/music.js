/*
This command will play a song
*/

const axios = require("axios");
const { MessageEmbed, Util, MessageButton, MessageActionRow, MessageSelectMenu} = require("discord.js");

module.exports = {
    name: "music",
    description: "Music commands supports, Youtube, Spotify, Apple songs and playlists.",
    options: [
        {
            name: "play",
            description: "Supports Youtube, Spotify, and Apple.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "name",
                    description: "Song/Playlist name or link.",
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
            name: "clear",
            description: "Clears the queue.",
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
            name: "unpause",
            description: "Unpauses the queue.",
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
                    type: "NUMBER",
                    required: true
                }
            ]
        },
        {
            name: "disconnect",
            description: "Disconnect the bot from voice.",
            type: "SUB_COMMAND",
        },
        // {
        //     name: "seek",
        //     description: "Seek the current track.",
        //     type: "SUB_COMMAND",
        //     options: [
        //         {
        //             name: "time",
        //             description: "Amount to seek.",
        //             required: true,
        //             type: "NUMBER"
        //         }
        //     ]
        // },
        {
            name: "stop",
            description: "Stop, but don't disconnect the bot.",
            type: "SUB_COMMAND",
        },
        {
            name: "remove",
            description: "Remove tracks from the queue.",
            type: "SUB_COMMAND",
            options: [
                {
                    name: "queue-position",
                    description: "Position of the song in the queue.",
                    required: true,
                    type: "NUMBER"
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
        interaction.deferReply({fetchReply: true})
        const songName = interaction.options.getString("name");
        const mode = interaction.options.getString("mode");
        const volume = interaction.options.getNumber("volume");
        // const seek = interaction.options.getNumber("time");
        const queuePosition = interaction.options.getNumber("queue-position");
        let queue = interaction.client.player.getQueue(interaction.guild.id);

        if (interaction.options.getSubcommand() === "play") {
            if (queue == null)
                queue = interaction.client.player.createQueue(interaction.guild.id);
            try {
                await queue.join(interaction.member.voice.channel);
            } catch (e) {
                return interaction.followUp({content: "Join a voice channel."})
            }
            let playlistSong = null;
            let song = null;

            // let normalSong = false;
            playlistSong = await queue.playlist(songName, {requestedBy: interaction.user}).catch(async playlistResponse => {
                console.log(playlistResponse)
                // normalSong = true;
                song = await queue.play(songName, {requestedBy: interaction.user}).catch(songResponse => {
                    console.log(songResponse)
                    return interaction.followUp({content: "There was a problem playing this track."})
                });
            });

            const addedEmbed = new MessageEmbed()
                .setColor("RANDOM")
                .setTimestamp()

            if (song != null) {
                console.log(song)
                try {
                    addedEmbed
                        .setTitle(`${song.name} was added to the queue.`)
                        .setURL(`${song.url}`)
                        .setAuthor(`${song.author}`)
                        .setThumbnail(`${song.thumbnail}`)
                        .setDescription(`${song.requestedBy} (${song.requestedBy.tag})`)
                        .addFields(
                            {name: 'Total Entries', value: `${queue.songs.length}`, inline: true},
                            {name: 'Song Duration', value: `${song.duration}`, inline: true},
                            {name: 'Total Queue Duration', value: `${getDuration(queue, 0, queue.songs.length)}`, inline: true}
                        )
                    return interaction.followUp({embeds: [addedEmbed]})
                } catch (e) {
                    console.log(e)
                    return interaction.followUp({content: "There was a problem adding to the queue."})
                }
            }
            else if (playlistSong != null) {
                try {
                    addedEmbed
                        .setTitle(`${playlistSong.name} was added to the queue.`)
                        .setURL(`${playlistSong.url}`)
                        .setDescription(`${playlistSong.songs.length} new songs were added\n${playlistSong.songs[0].requestedBy} (${playlistSong.songs[0].requestedBy.tag})`)
                        .addFields(
                            {name: 'Total Entries', value: `${queue.songs.length}`, inline: true},
                            {name: 'Playlist Duration', value: `${getDuration(playlistSong, 0, playlistSong.songs.length)}`, inline: true},
                            {name: 'Total Queue Duration', value: `${getDuration(queue, 0, queue.songs.length)}`, inline: true}
                        )
                    return interaction.followUp({embeds: [addedEmbed]})
                } catch (e) {
                    console.log(e)
                    return interaction.followUp({content: "There was a problem adding to the queue."})
                }
            }
            else {
                console.log("Not song or playlist")
                return interaction.followUp({content: "There was a problem adding to the queue."})
            }
        } else if (interaction.options.getSubcommand() === "queue") {
            if (queue == null)
                return interaction.followUp({content: "There is no queue."})

            try {
                let startQueue = 0;
                let endQueue = 10;

                const queueMessage = await interaction.followUp({embeds: [createQueueEmbed(queue, startQueue, endQueue)], components: createRows(queue)})

                // const userFilter = (input) => input.user.id == interaction.user.id;
                const collector = interaction.channel
                    .createMessageComponentCollector({ time: 840000, idle: 30000})
                    // .createMessageComponentCollector({ filter: userFilter, time: 840000, idle: 30000})
                collector.on('collect', async input => {
                    // console.log(input.user.id)
                    // console.log(interaction.user.id)
                    try{
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
                            }
                            else
                                startQueue += 10;
                        } else if (input.customId === 'last') {
                            startQueue = queue.songs.length-10;
                            endQueue = queue.songs.length;
                        } else if (input.customId === 'shuffle') {
                            if (queue != null)
                                queue.shuffle();
                        } else if (input.customId === 'play') {
                            if (queue.isPlaying)
                                queue.setPaused(false);
                        } else if (input.customId === 'pause') {
                            if (queue.isPlaying)
                                queue.setPaused(true);
                        } else if (input.customId === 'skip') {
                            if (queue.isPlaying)
                                queue.skip();
                        } else if (input.customId === 'repeatQueue') {
                            if (queue.isPlaying)
                                queue.setRepeatMode(2)
                        } else if (input.customId === 'repeatTrack') {
                            if (queue.isPlaying)
                                queue.setRepeatMode(1)
                        } else if (input.customId === 'repeatStop') {
                            if (queue.isPlaying)
                                queue.setRepeatMode(0)
                        } else {
                            queue.setVolume(input.values[0]);
                        }
                        if (queue == null) return;
                        if (!queue.isPlaying) {
                            await input.update({embeds: [createQueueEmbed(queue, startQueue, endQueue)], components: []})
                        }
                        else
                            await input.update({embeds: [createQueueEmbed(queue, startQueue, endQueue)], components: createRows(queue)})

                    } catch (e) {
                        // console.log(e)
                    }
                });
                collector.on('end', collected => {
                    try {
                        queueMessage.edit({embeds: [createQueueEmbed(queue, startQueue, endQueue)], components: []})
                        // collected.get([...collected.keys()][0]).message.edit({embeds: [createQueueEmbed(queue, startQueue, endQueue)], components: []})
                    } catch (e) {
                        // console.log(e)
                    }
                });

            } catch (e) {
                console.log(e)
                return interaction.followUp("There was a problem with printing the queue.")
            }
        }
        else if (interaction.options.getSubcommand() === "skip") {
            if (queue == null)
                return interaction.followUp({content: "Nothing is playing right now."})
            const song = await queue.skip();
            if (!queue.isPlaying)
                return interaction.followUp({content: `No song to skip.`})
            else
                return interaction.followUp({content: `${song.name} is skipped.`})
        } else if (interaction.options.getSubcommand() === "clear") {
            if (queue == null || queue.songs.length < 1)
                return interaction.followUp({content: "Nothing to clear."})
            queue.clearQueue();
            return interaction.followUp({content: `The queue is cleared.`})
        }  else if (interaction.options.getSubcommand() === "loop") {
            if (queue == null)
                return interaction.followUp({content: "Nothing is playing right now."})
            if (!queue.isPlaying)
                return interaction.followUp({content: "Nothing is playing right now."})
            switch (mode) {
                case "track":
                    queue.setRepeatMode(1)
                    return interaction.followUp({content: `${queue.nowPlaying.name} is looped.`})
                case "queue":
                    queue.setRepeatMode(2)
                    return interaction.followUp({content: "Queue is looped."})
                case "off":
                    queue.setRepeatMode(0)
                    return interaction.followUp({content: "Loop is turned off."})
            }
        } else if (interaction.options.getSubcommand() === "lyrics") {
            if (queue == null)
                return interaction.followUp({content: "Nothing is playing right now."})
            if (!queue.isPlaying)
                return interaction.followUp({content: "Nothing is playing right now."})

            const name = queue.nowPlaying.name;
            const url = new URL(`https://some-random-api.ml/lyrics`);
            url.searchParams.append("title", name);

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
        } else if (interaction.options.getSubcommand() === "pause") {
            if (queue == null)
                return interaction.followUp({content: "Nothing is playing right now."})
            if (!queue.isPlaying)
                return interaction.followUp({content: "Nothing is playing right now."})
            queue.setPaused(true);
            return interaction.followUp({content: `${queue.nowPlaying.name} is paused.`})
        } else if (interaction.options.getSubcommand() === "unpause") {
            if (queue == null)
                return interaction.followUp({content: "Nothing is playing right now."})
            if (!queue.isPlaying)
                return interaction.followUp({content: "Nothing is in queue right now."})
            queue.setPaused(false);
            return interaction.followUp({content: `${queue.nowPlaying.name} is resumed.`})
        } else if (interaction.options.getSubcommand() === "shuffle") {
            if (queue == null)
                return interaction.followUp({content: "Nothing is playing right now."})
            queue.shuffle();
            return interaction.followUp({content: "Queue is shuffled."})
        } else if (interaction.options.getSubcommand() === "np") {
            if (queue == null)
                return interaction.followUp({content: "Nothing is playing right now."})
            if (!queue.isPlaying)
                return interaction.followUp({content: "Nothing is in queue right now."})

            const ProgressBar = queue.createProgressBar({block: `▬`, arrow: `⚪`});
            const nowPlayingEmbed = new MessageEmbed()
                .setColor("RANDOM")
                .setAuthor(queue.nowPlaying.author)
                .setTitle(`Now Playing: ${queue.nowPlaying.name}`)
                .setURL(queue.nowPlaying.url)
                .setThumbnail(queue.nowPlaying.thumbnail)
                .setTimestamp()
            if (queue.paused)
                nowPlayingEmbed.setDescription(`⏸ Requested By: ${queue.nowPlaying.requestedBy} (${queue.nowPlaying.requestedBy.tag}) \n${ProgressBar.prettier}`)
            else
                nowPlayingEmbed.setDescription(`▶ Requested By: ${queue.nowPlaying.requestedBy} (${queue.nowPlaying.requestedBy.tag}) \n${ProgressBar.prettier}`)

            return interaction.followUp({embeds: [nowPlayingEmbed]})
        } else if (interaction.options.getSubcommand() === "set-volume") {
            if (queue == null)
                return interaction.followUp({content: "Nothing is playing right now."})
            queue.setVolume(volume);
            return interaction.followUp({content: "Volume has been changed."})
        } else if (interaction.options.getSubcommand() === "stop") {
            if (queue == null)
                return interaction.followUp({content: "Nothing is playing right now."})
            queue.stop();
            return interaction.followUp({content: "Player has stopped."})
        } else if (interaction.options.getSubcommand() === "remove") {
            if (queue == null)
                return interaction.followUp({content: "Nothing in queue."})
            if (queue.songs.length < 1)
                return interaction.followUp({content: "Nothing in queue."})
            const song = queue.remove(queuePosition-1);
            if (song != null)
                return interaction.followUp({content: `Removed song: ${song.name} at position: ${queuePosition}`})
            return interaction.followUp({content: `Could not remove song.`})
        }
        else if (interaction.options.getSubcommand() === "disconnect") {
            if (queue == null)
                return interaction.followUp({content: "Nothing is playing right now."})
            queue.connection.leave();
            return interaction.followUp({content: "Player has left."})
        }
        // else if (interaction.options.getSubcommand() === "seek") {
        //     if (queue == null) {
        //         return interaction.followUp({content: "Nothing is playing right now."})
        //     }
        //     if (queue.nowPlaying == null)
        //         return interaction.followUp({content: "Nothing is in queue right now."})
        //
        //     await queue.seek(seek)
        //     return interaction.followUp({content: `Seeked by ${seek}.`})
        // }
        else  {
            return interaction.followUp({content: "There was a problem with this command."})
        }
    }
};

function createQueueEmbed (queue, startQueue, endQueue) {
    let nowPlaying;
    let repeating = "";
    let volume = "";

    if (!queue.isPlaying)
        nowPlaying = "Nothing is being played."
    else {
        const ProgressBar = queue.createProgressBar({block: `▬`, arrow: `⚪`});
        if (queue.paused)
            nowPlaying = `⏸ [${queue.nowPlaying.name}](${queue.nowPlaying.url}) - Requested by: ${queue.nowPlaying.requestedBy} (${queue.nowPlaying.requestedBy.tag})\n${ProgressBar.prettier}`
        else
            nowPlaying = `▶ [${queue.nowPlaying.name}](${queue.nowPlaying.url}) - Requested by: ${queue.nowPlaying.requestedBy} (${queue.nowPlaying.requestedBy.tag})\n${ProgressBar.prettier}`
    }

    switch (queue.repeatMode) {
        case 0:
            repeating = `❌`
            break;
        case 1:
            repeating =`🔂`
            break;
        case 2:
            repeating =`🔁`
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
            {name: 'Total Queue Duration', value: `${getDuration(queue, 0, queue.length)}`, inline: true},
            {name: 'Repeating', value: `${repeating}`, inline: true},
            {name: `${volume}`, value: `${queue.volume}`, inline: true},
        )
        .setTimestamp()
        .setDescription(`${getDescription(queue, startQueue, endQueue)}`);
}

function getDuration (queue, startQueue, endQueue) {
    const slicedArray = queue.songs.slice(startQueue, endQueue);
    let duration = 0;
    slicedArray.forEach(song => {
        const time = song.duration; //hh:mm:ss
        let splitTime = time.split(`:`);
        let ms = 0;
        if (splitTime.length === 3) {
            ms = Number(splitTime[0]) * 60 * 60 * 1000 + Number(splitTime[1]) * 60 * 1000 + Number(splitTime[2]) * 1000;
        }
        else  if (splitTime.length === 2) {
            ms = Number(splitTime[0]) * 60 * 1000 + Number(splitTime[1]) * 1000;
        }
        duration += ms
    });
    return msToTime(duration);
}

function msToTime(ms) {
    let seconds = (ms / 1000).toFixed(1);
    let minutes = (ms / (1000 * 60)).toFixed(1);
    let hours = (ms / (1000 * 60 * 60)).toFixed(1);
    let days = (ms / (1000 * 60 * 60 * 24)).toFixed(1);
    if (seconds < 60) return seconds + " Sec";
    else if (minutes < 60) return minutes + " Min";
    else if (hours < 24) return hours + " Hrs";
    else return days + " Days";
}

function getDescription (queue, startQueue, endQueue) {
    let description = ``;
    for (let i = startQueue; i < endQueue; i++) {
        try {
            description += `${i + 1}) \`\`${queue.songs[i].duration}\`\` [${queue.songs[i].name}](${queue.songs[i].url}) - ${queue.songs[i].requestedBy} (${queue.songs[i].requestedBy.tag}) Time Until: \`\`${getDuration(queue, 0, i)}\`\`\n`
        }catch (e) {
            // console.log(e)
        }
    }
    return description;
}

function createRows (queue) {
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
    } else if (queue.repeatMode === 2){
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