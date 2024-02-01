const {Embed_saved} = require("../../embeds/embeds");
const { ActionRowBuilder, ButtonBuilder } = require('discord.js');
module.exports = {
    name: 'saved',
    aliases: [],
    description: 'View your saved songs',
    usage: 'saved',
    category: 'Music',
    voiceChannel: true,
    options: [],

    async execute(client, message) {
        const db = client.db;
        const user = await db.get(`user_${message.author.id}`);
        const savedSongs = user.savedSongs;

        if (!savedSongs || savedSongs.length == 0) {
            return message.reply({
                content: `${client.config.deny} | You have no saved songs.`,
                allowedMentions: {repliedUser: false}
            });
        }



    // Split the savedSongs array into chunks of 10
    let pages = [];
    for (let i = 0; i < savedSongs.length; i += 10) {
        pages.push(savedSongs.slice(i, i + 10));
    }

    let currentPage = 0; // Current page number
    // Create the buttons and action row
    let row = new ActionRowBuilder()
        .addComponents(
            new ButtonBuilder()
                .setCustomId('previous')
                .setLabel('Previous')
                .setStyle(1),
            new ButtonBuilder()
                .setCustomId('next')
                .setLabel('Next')
                .setStyle(1)
        );

    // Function to create song list for a specific page
    function createSongList(page) {
        let songList = '';
        for (let i = 0; i < pages[page].length; i++) {
            songList += `${i + 1}. [${pages[page][i].title}](${pages[page][i].url})\n`;
        }
        return songList;
    }

// Send the first page
    message.reply({ embeds: [Embed_saved(createSongList(currentPage), message.author)], components: [row],  allowedMentions: {repliedUser: false}}).then(msg => {
        // Create a button collector
        const filter = (button) => button.user.id === message.author.id;
        const collector = msg.createMessageComponentCollector({ filter, time:    60000 });

        collector.on('collect', async (button) => {
            // Increase or decrease the page number based on the button clicked
            if (button.customId === 'nextSaved') {
                currentPage = Math.min(currentPage + 1, pages.length - 1);
            } else if (button.customId === 'previousSaved') {
                currentPage = Math.max(currentPage - 1, 0);
            }

            // Update the message with the new page
            await button.update({ embeds: [Embed_saved(createSongList(currentPage), message.author)], components:   [row] });
        });
    });

    },
    async slashExecute(client, interaction) {}
};