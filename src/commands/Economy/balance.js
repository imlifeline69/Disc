const embed = require('../../embeds/embeds.js');
const textMessage = require('../../embeds/textMessage.js');

module.exports = {
    name: 'balance',
    aliases: ['bal', 'cash', 'bank'],
    description: 'View your balance',
    usage: 'balance',
    category: 'Economy',
    options: [
        {
            name: 'user',
            type: 6,
            description: 'User to view balance',
            required: false,
        }
    ],

    async execute(client, message) {
        let db = client.db;
        let usr = message.mentions.users.first() || message.author;
        const user = await db.get(`user_${usr.id}`);
        if(!user) {
            await db.set(`user_${usr.id}`, { balance: 0, bank: 0 });
        }
        let settings = await db.get(`user_${message.author.id}.settings`);
        if(!settings) {
            settings = {
                messageType: 'embed',
                color: client.config.embedColor,
            }
        }
        if(settings.messageType === 'text') {
            return message.reply({ content: textMessage.Text_balance(usr, user.balance, user.bank), allowedMentions: { repliedUser: false } });
        } else if(settings.messageType === 'embed') {
            return message.reply({ embeds: [embed.Embed_balance(usr, user.balance, user.bank)], allowedMentions: { repliedUser: false } });
        }
    },
    async slashExecute(client, interaction) {
        let db = client.db;
        let usr = interaction.options.get('user')?.user || interaction.user;
        const user = await db.get(`user_${usr.id}`);
        if(!user) {
            await db.set(`user_${usr.id}`, { balance: 0, bank: 0 });
        }
        interaction.reply({ embeds: [embed.Embed_balance(usr, user.balance, user.bank)], allowedMentions: { repliedUser: false } });
    },
}