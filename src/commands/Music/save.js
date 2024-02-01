const embed = require('../../embeds/embeds');


module.exports = {
    name: 'save',
    aliases: [],
    description: 'Save the current song',
    usage: 'save',
    category: 'Music',
    voiceChannel: true,
    options: [],

    async execute(client, message) {
        const db = client.db;
        const queue = client.player.nodes.get(message.guild.id);
        const user = await db.get(`user_${message.author.id}`);


        if (!queue || !queue.isPlaying())
            return message.reply({ content: `${client.config.deny} | There is no music currently playing!. `, allowedMentions: { repliedUser: false } });


        const track = queue.currentTrack;
        const timestamp = queue.node.getTimestamp();
        const trackDuration = timestamp.progress == 'Forever' ? 'Endless (Live)' : track.duration;
        let description = `Author : **${track.author}**\nDuration **${trackDuration}**`;
        const savedSongsScope = user.savedSongs;
        let savedSongs;
        if (savedSongsScope) {
            savedSongs = savedSongsScope.find(s => s.url === track.url);
        }

        if (!savedSongs) {
          let songInfo = {
                title: track.title,
                url: track.url,
                artist: track.author,
          }
            user.savedSongs.push(songInfo);
            db.set(`user_${message.author.id}`, user);
            return message.reply({ content: `${client.config.accept} | Saved track: **${track.title}** | ${track.author}`, allowedMentions: {repliedUser: false}});

        } else if (savedSongs) {
            return message.reply({
                content: `${client.config.deny} | This song is already saved.`,
                allowedMentions: {repliedUser: false}
            });
        }

        message.author.send({ embeds: [embed.Embed_save(track.title, track.url, track.thumbnail, description)] })
            //message.author.send(`Registered track: **${track.title}** | ${track.author}, Saved server: **${message.guild.name}** ${client.config.accept}`)
            .then(() => {
                message.react(client.config.reactEmote);
            })
            .catch(error => {
                console.log('error: ' + error);
                message.react('${client.config.deny}');
            });
    },

    async slashExecute(client, interaction) {
        const db = client.db;
        const queue = client.player.nodes.get(interaction.guild.id);
        const user = await db.get(`user_${interaction.user.id}`);

        if (!queue || !queue.isPlaying())
            return interaction.reply({ content: `${client.config.deny} | There is no music currently playing!. `, allowedMentions: { repliedUser: false } });

        const track = queue.currentTrack;
        const timestamp = queue.node.getTimestamp();
        const trackDuration = timestamp.progress == 'Forever' ? 'Endless (Live)' : track.duration;
        let description = `Author : **${track.author}**\nDuration **${trackDuration}**`;
        const savedSongs = user.savedSongs;
        if (!savedSongs) {
          let songInfo = {
                title: track.title,
                url: track.url,
          }
            user.savedSongs = [];
            user.savedSongs.push(songInfo);
            db.set(`user_${interaction.user.id}`, user);
            return interaction.reply({ content: `${client.config.accept} | Saved track: **${track.title}** | ${track.author}`, allowedMentions: {repliedUser: false}});
        } else if (savedSongs) {
            savedSongs.find(s => s.url === track.url);
            return interaction.reply({
                content: `${client.config.deny} | This song is already saved.`,
                allowedMentions: {repliedUser: false}
            });
        }
        interaction.user.send({ embeds: [embed.Embed_save(track.title, track.url, track.thumbnail, description)] })
            //interaction.user.send(`Registered track: **${track.title}** | ${track.author}, Saved server: **${interaction.guild.name}** ${client.config.accept}`)
            .then(() => {
                interaction.react(client.config.reactEmote);
            })
            .catch(error => {
                console.log('error: ' + error);
                interaction.react('${client.config.deny}');
            });
    },
};