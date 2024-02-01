module.exports = {
    name: 'back',
    aliases: ['b', 'rewind'],
    description: 'Back to previous song',
    usage: 'back',
    voiceChannel: true,
    category: 'Music',
    options: [],

    async execute(client, message) {
        const queue = client.player.nodes.get(message.guild.id);

        if (!queue || !queue.isPlaying())
            return message.reply({ content: `${client.config.deny} | No music currently playing.`, allowedMentions: { repliedUser: false } });

        if (!queue.history.previousTrack)
            return message.reply({ content: `${client.config.deny} | There was no music playing before.`, allowedMentions: { repliedUser: false } });

        await queue.history.back();
        return await message.react(client.config.reactEmote);
    },

    async slashExecute(client, interaction) {
        const queue = client.player.nodes.get(interaction.guild.id);

        if (!queue || !queue.isPlaying())
            return interaction.reply({ content: `${client.config.deny} | No music currently playing.`, allowedMentions: { repliedUser: false } });

        if (!queue.history.previousTrack)
            return interaction.reply({ content: `${client.config.deny} | There was no music playing before.`, allowedMentions: { repliedUser: false } });

        await queue.history.back();
        return await interaction.reply("${client.config.accept} | Music rewound.");
    },
};