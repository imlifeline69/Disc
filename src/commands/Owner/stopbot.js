module.exports = {
    name: 'stopbt',
    aliases: ['stbt'],
    description: 'Stop the bot client',
    usage: 'stopbt',
    category: 'Owner',
    showHelp: false,
    options: [],

    async execute(client, message) {
        await message.reply({ content: 'Stopping the bot...', allowedMentions: { repliedUser: false } });
        client.destroy();
    },
    slashExecute(client, interaction) {
        const botPing = `${Date.now() - interaction.createdTimestamp}ms`;
        interaction.reply({ embeds: [embed.Embed_ping(botPing, client.ws.ping)], allowedMentions: { repliedUser: false } });
    },
}