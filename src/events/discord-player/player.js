const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

const embed = require(`${__dirname}/../../embeds/embeds`);
const { button } = require(`${__dirname}/../../utils/constants`);
const { settings } = require(`${__dirname}/../../utils/player/settings`);
const { finishPlaying } = require(`${__dirname}/../../utils/player/finishPlaying`);


const registerPlayerEvents = (player, client) => {

    player.events.on('connection', async (queue) => {
        const playPauseButton = new ButtonBuilder().setCustomId('Playing-PlayPause').setEmoji(button.pause).setStyle(ButtonStyle.Secondary);
        const skipButton = new ButtonBuilder().setCustomId('Playing-Skip').setEmoji(button.skip).setStyle(ButtonStyle.Secondary);
        const stopButton = new ButtonBuilder().setCustomId('Playing-Stop').setEmoji(button.stop).setStyle(ButtonStyle.Danger);
        const loopButton = new ButtonBuilder().setCustomId('Playing-Loop').setEmoji(button.loop).setStyle(ButtonStyle.Secondary);
        const shuffleButton = new ButtonBuilder().setCustomId('Playing-Shuffle').setEmoji(button.shuffle).setStyle(ButtonStyle.Secondary);
        const row = new ActionRowBuilder().addComponents(playPauseButton, skipButton, stopButton, loopButton, shuffleButton);

        queue.dashboard = await queue.metadata.channel.send({ embeds: [embed.Embed_connect()], components: [row] });
        return;
    });

    player.events.on('playerStart', async (queue, track) => {
        let playing = queue.node.isPaused();
        const requestedBy = track.requestedBy ? track.requestedBy : client.user;

        const playPauseButton = new ButtonBuilder().setCustomId('Playing-PlayPause').setEmoji(playing ? button.play : button.pause).setStyle(ButtonStyle.Secondary);
        const skipButton = new ButtonBuilder().setCustomId('Playing-Skip').setEmoji(button.skip).setStyle(ButtonStyle.Secondary);
        const stopButton = new ButtonBuilder().setCustomId('Playing-Stop').setEmoji(button.stop).setStyle(ButtonStyle.Danger);
        const loopButton = new ButtonBuilder().setCustomId('Playing-Loop').setEmoji(button.loop).setStyle(ButtonStyle.Secondary);
        const shuffleButton = new ButtonBuilder().setCustomId('Playing-Shuffle').setEmoji(button.shuffle).setStyle(ButtonStyle.Secondary);
        const row = new ActionRowBuilder().addComponents(playPauseButton, skipButton, stopButton, loopButton, shuffleButton);

        return await queue.dashboard.edit({ embeds: [embed.Embed_dashboard('Dashboard', track.title, track.url, track.thumbnail, settings(queue), requestedBy )], components: [row] });
    });

    player.events.on('audioTrackAdd', async (queue, track) => {
        if (queue.isPlaying()) {
            const author = track.author;
            const timestamp = queue.node.getTimestamp();
            const trackDuration = timestamp.progress == 'Forever' ? 'Endless (Live)' : track.duration;
            const requestedBy = track.requestedBy ? track.requestedBy : client.user;
            await queue.metadata.channel.send({ embeds: [embed.Embed_add('Added', track.title, track.url, track.thumbnail, author, trackDuration, requestedBy)] });

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
            return;
        }
    });

    player.events.on('playerError', (queue, error) => {
        console.log(`I'm having trouble connecting => ${error.message}`);

        if (error.message.includes('Sign in to confirm your age')) {
            if (queue.tracks.data.length < 1) {
                if (!queue.deleted) queue.delete();
                finishPlaying(queue);
                return queue.metadata.channel.send({ content: `❌ | I can't play Age-restricted videos.`, allowedMentions: { repliedUser: false } });
            }

            else {
                queue.node.skip();
                return queue.metadata.channel.send({ content: `❌ | I skipped Age-restricted video.`, allowedMentions: { repliedUser: false } });
            }
        }
    });

    player.events.on('error', (queue, error) => {
        console.log(`There was a problem with the song queue => ${error.message}`);
    });

    player.events.on('emptyChannel', (queue) => {
        if (!client.config.autoLeave) queue.node.stop();

        finishPlaying(queue);
    });

    player.events.on('disconnect', (queue) => {
        finishPlaying(queue);
    });

    player.events.on('emptyQueue', (queue) => {
        finishPlaying(queue);
    });
}
module.exports = registerPlayerEvents;