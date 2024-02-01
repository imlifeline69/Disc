const Discord = require('discord.js');
module.exports = {
    name: 'ship',
    aliases: ['love', 'lovecalc', 'lovecalculator'],
    description: 'Calculate love percentage between two users',
    usage: 'ship <user1> <user2>',
    category: 'Misc',
    options: [
        {
            name: "user1",
            description: "First user",
            type: 6,
            required: true
        },
        {
            name: "user2",
            description: "Second user",
            type: 6,
            required: true
        }
    ],

    async execute(client, message, args) {
        const user1 = message.mentions.users.first();
        const user2 = message.mentions.users.last();
        if (!user1 || !user2)
            return message.reply({ content: `${client.config.deny} | Please mention two users.`, allowedMentions: { repliedUser: false } });

        const user1Name = user1.username.length > 10 ? user1.username.substring(0, 10) : user1.username;
        const user2Name = user2.username.length > 10 ? user2.username.substring(0, 10) : user2.username;

        const love = Math.random() * 100;
        const loveIndex = Math.floor(love / 10);
        const loveLevel = "💖".repeat(loveIndex) + "💔".repeat(10 - loveIndex);

        const embed = new Discord.EmbedBuilder()
            .setColor(client.config.embedColor)
            .setTitle(`Ship ${user1Name} & ${user2Name}`)
            .setDescription(`💟 ${Math.floor(love)}%\n\n${loveLevel}`);

        message.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    },
    async slashExecute(client, interaction) {
        const user1 = interaction.options.get('user1').user;
        const user2 = interaction.options.get('user2').user;
        const user1Name = user1.username.length > 10 ? user1.username.substring(0, 10) : user1.username;
        const user2Name = user2.username.length > 10 ? user2.username.substring(0, 10) : user2.username;

        const love = Math.random() * 100;
        const loveIndex = Math.floor(love / 10);
        const loveLevel = "💖".repeat(loveIndex) + "💔".repeat(10 - loveIndex);

        const embed = new Discord.EmbedBuilder()
            .setColor(client.config.embedColor)
            .setTitle(`Ship ${user1Name} & ${user2Name}`)
            .setDescription(`💟 ${Math.floor(love)}%\n\n${loveLevel}`);

        interaction.reply({ embeds: [embed], allowedMentions: { repliedUser: false } });
    }
};