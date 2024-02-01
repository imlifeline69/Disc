const { ActionRowBuilder, ButtonBuilder, ButtonStyle, User } = require('discord.js');

const embed = require('../../embeds/embeds');
const { button } = require('../../utils/constants');
const { settings } = require('../../utils/player/settings');


module.exports = {
    name: 'dashboard',
    aliases: ['d', 'main'],
    description: 'Move the dashboard embed to the bottom',
    usage: 'dashboard',
    category: 'Music',
    voiceChannel: true,
    options: [],

    async execute(client, message) {
        const queue = client.player.nodes.get(message.guild.id);

        if (!queue || !queue.isPlaying())
            return message.reply({ content: `${client.config.deny} | No music currently playing.`, allowedMentions: { repliedUser: false } });


        try {
            await queue.dashboard.delete();
        } catch (error) {
            console.log('Dashboard delete error:', error);
        }

        let playing = queue.node.isPaused();

        const playPauseButton = new ButtonBuilder().setCustomId('Playing-PlayPause').setEmoji(playing ? button.play : button.pause).setStyle(ButtonStyle.Secondary);
        const skipButton = new ButtonBuilder().setCustomId('Playing-Skip').setEmoji(button.skip).setStyle(ButtonStyle.Secondary);
        const stopButton = new ButtonBuilder().setCustomId('Playing-Stop').setEmoji(button.stop).setStyle(ButtonStyle.Danger);
        const loopButton = new ButtonBuilder().setCustomId('Playing-Loop').setEmoji(button.loop).setStyle(ButtonStyle.Secondary);
        const shuffleButton = new ButtonBuilder().setCustomId('Playing-Shuffle').setEmoji(button.shuffle).setStyle(ButtonStyle.Secondary);
        const row = new ActionRowBuilder().addComponents(playPauseButton, skipButton, stopButton, loopButton, shuffleButton);

        const cur = queue.currentTrack;
        const currequestedBy = cur.requestedBy ? cur.requestedBy : client.user;
        queue.dashboard = await queue.metadata.channel.send({ embeds: [embed.Embed_dashboard('Dashboard', cur.title, cur.url, cur.thumbnail, settings(queue), currequestedBy)], components: [row] });
        return await message.react(client.config.reactEmote);
    },

    async slashExecute(client, interaction) {
        const queue = client.player.nodes.get(interaction.guild.id);

        if (!queue || !queue.isPlaying())
            return interaction.reply({ content: `${client.config.deny} | No music currently playing.`, allowedMentions: { repliedUser: false } });


        try {
            await queue.dashboard.delete();
        } catch (error) {
            console.log('Dashboard delete error:', error);
        }

        let playing = queue.node.isPaused();

        const playPauseButton = new ButtonBuilder().setCustomId('Playing-PlayPause').setEmoji(playing ? button.play : button.pause).setStyle(ButtonStyle.Secondary);
        const skipButton = new ButtonBuilder().setCustomId('Playing-Skip').setEmoji(button.skip).setStyle(ButtonStyle.Secondary);
        const loopButton = new ButtonBuilder().setCustomId('Playing-Loop').setEmoji(button.loop).setStyle(ButtonStyle.Secondary);
        const stopButton = new ButtonBuilder().setCustomId('Playing-Stop').setEmoji(button.stop).setStyle(ButtonStyle.Danger);
        const shuffleButton = new ButtonBuilder().setCustomId('Playing-Shuffle').setEmoji(button.shuffle).setStyle(ButtonStyle.Secondary);
        const row = new ActionRowBuilder().addComponents(playPauseButton, skipButton, loopButton, stopButton, shuffleButton);

        const cur = queue.currentTrack;
        const currequestedBy = cur.requestedBy ? cur.requestedBy : client.user;
        queue.dashboard = await queue.metadata.channel.send({ embeds: [embed.Embed_dashboard('Dashboard', cur.title, cur.url, cur.thumbnail, settings(queue), currequestedBy)], components: [row] });
        return await interaction.reply("${client.config.accept} | Dashboard updated.");
    },
};