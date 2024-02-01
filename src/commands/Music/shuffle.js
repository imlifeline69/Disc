module.exports = {
    name: 'shuffle',
    aliases: ['random'],
    description: 'Shuffle Playlist',
    usage: 'random',
    category: 'Music',
    voiceChannel: true,
    options: [],

    async execute(client, message) {
        const queue = client.player.nodes.get(message.guild.id);

        if (!queue || !queue.isPlaying())
            return message.reply({ content: `${client.config.deny} | There is no music currently playing!.`, allowedMentions: { repliedUser: false } });

        queue.tracks.shuffle();
        return message.react(client.config.reactEmote);
    },

    slashExecute(client, interaction) {
        const queue = client.player.nodes.get(interaction.guild.id);

        if (!queue || !queue.isPlaying())
            return interaction.reply({ content: `${client.config.deny} | There is no music currently playing!.`, allowedMentions: { repliedUser: false } });

        queue.tracks.shuffle();
        return interaction.reply('${client.config.accept} | Music shuffled.');
    },
};