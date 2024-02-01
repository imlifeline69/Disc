const embed = require('../../embeds/embeds');
const { lyricsExtractor } = require("@discord-player/extractor");
const lyricsFinder = lyricsExtractor();
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'lyrics',
    aliases: ['ly'],
    description: 'Get the lyrics of the current playing song',
    usage: 'lyrics <page number>',
    category: 'Music',
    voiceChannel: true,
    options: [],

    async execute(client, message, args) {
        const queue = client.player.nodes.get(message.guild.id);

        if (!queue || !queue.isPlaying())
            return message.reply({ content: `${client.config.deny} | There is no music currently playing.`, allowedMentions: { repliedUser: false } });

        const track = queue.currentTrack;

        const queryFormated = track.title
        .toLowerCase()
        .replace(/\(lyrics|lyric|official music video|official video hd|official video|audio|official|clip officiel|clip|extended|hq\)/g,
        "");
        const result = await lyricsFinder.search(queryFormated).catch(() => null);
        if (!result) return message.channel.send(`No lyrics found for ${track.title}.`);
        let lyrics = result.lyrics
        lyrics = lyrics || 'Lyrics not available';

        let lyricsSections = lyrics.replace(/\[(.*?)\]/g, '**[$1]**');

        let maxPageLength = 4096;
        let lyricsPages = splitIntoPages(lyricsSections, maxPageLength);

        let embeds = lyricsPages.map((lyrics, i) => new EmbedBuilder()
            .setTitle(lyricsPages.length > 1 ? `Lyrics for ${track.title} (Page ${i+1}/${lyricsPages.length})` : `Lyrics for ${track.title}`)
            .setDescription(lyrics)
            .setAuthor({ name: result.artist.name, iconURL: result.artist.image, url: result.artist.url })
            .setTimestamp()
        );

        let pageNumber = args[0] ? parseInt(args[0]) : 1;
        if (isNaN(pageNumber) || pageNumber < 1 || pageNumber > embeds.length) {
            return message.channel.send(`Invalid page number. Please enter a number between 1 and ${embeds.length}.`);
        }

        // Subtract 1 from the page number because arrays are 0-indexed
        let currentPage = pageNumber - 1;

        await message.channel.send({ embeds: [embeds[currentPage]] });
    },

    slashExecute(client, interaction) {
        const botPing = `${Date.now() - interaction.createdTimestamp}ms`;
        interaction.reply({ embeds: [embed.Embed_ping(botPing, client.ws.ping)], allowedMentions: { repliedUser: false } });
    },
};

function splitIntoPages(textSections, maxPageLength) {
    let pages = [];
    let currentPage = '';

    for (let section of textSections) {
        if ((currentPage.length + section.length) > maxPageLength) {
            pages.push(currentPage);
            currentPage = section;
        } else {
            currentPage += section;
        }
    }

    if (currentPage) {
        pages.push(currentPage);
    }

    return pages;
}