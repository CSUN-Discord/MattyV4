const {client} = require("../../index")
const {MessageEmbed} = require("discord.js")

let playingMessage;

const status = queue => `Volume: \`${queue.volume}%\` | Filter: \`${queue.filters.join(", ") || "Off"}\` | Loop: \`${queue.repeatMode ? queue.repeatMode === 2 ? "All Queue" : "This Song" : "Off"}\` | Autoplay: \`${queue.autoplay ? "On" : "Off"}\``
client.distube
    .on("playSong", (queue, song) => {
        try {
            playingMessage.delete();

            queue.textChannel.send(
                {
                    embeds: [
                        new MessageEmbed()
                            .setColor("RANDOM")
                            .setDescription(`Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user}\n${status(queue)}`)
                    ]
                }
            ).then((message) => {
                playingMessage = message;
            }).catch()
        } catch (e) {
        }

    })

    .on("addSong", (queue, song) => {
        const addedEmbed = new MessageEmbed()
            .setTitle(`${song.name} was added to the queue.`)
            .setURL(`${song.url}`)
            .setAuthor(`${song.uploader.name}`)
            .setThumbnail(`${song.thumbnail}`)
            .setDescription(`${song.user} (${song.user.tag})`)
            .addFields(
                {name: 'Total Entries', value: `${queue.songs.length}`, inline: true},
                {name: 'Song Duration', value: `${song.formattedDuration}`, inline: true},
                {name: 'Total Queue Duration', value: `${queue.formattedDuration}`, inline: true}
            )
        try {
            queue.textChannel.send(
                {
                    embeds: [addedEmbed]
                }
            )
        } catch (e) {

        }
    })
    .on("addList", (queue, playlist) => {
        const addedEmbed = new MessageEmbed()
            .setTitle(`${playlist.name} was added to the queue.`)
            .setURL(`${playlist.url}`)
            .setDescription(`${playlist.songs.length} new songs were added.\n${playlist.user} (${playlist.user.tag})`)
            .addFields(
                {name: 'Total Entries', value: `${playlist.songs.length}`, inline: true},
                {
                    name: 'Playlist Duration',
                    value: `${playlist.formattedDuration}`,
                    inline: true
                },
                {name: 'Total Queue Duration', value: `${queue.formattedDuration}`, inline: true}
            )

        try {
            queue.textChannel.send(
                {
                    embeds: [addedEmbed]
                }
            )
        } catch (e) {

        }
    })

    .on("error", (channel, e) => {
        channel.send(
            {
                embeds: [new MessageEmbed().setColor("RED")
                    .setDescription(`An error encountered: ${e}`)
                ]
            }
        )
        console.error(e)
    })

    .on("searchNoResult", message => {
        message.channel.send(
            {
                embeds: [new MessageEmbed().setColor("RANDOM")
                    .setDescription(`No result found!`)]
            }
        )
    })

    .on("finish", queue => {
        queue.textChannel.send(
            {
                embeds: [new MessageEmbed().setColor("RANDOM")
                    .setDescription(`Queue finished!`)]
            }
        )
    })