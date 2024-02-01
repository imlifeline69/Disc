const embed = require('../../embeds/embeds.js');
const textMessage = require('../../embeds/textMessage.js');

module.exports = {
    name: 'deposit',
    aliases: ['dep'],
    description: 'Deposit money to your bank',
    usage: 'deposit <amount>',
    category: 'Economy',
    options: [{
        name: 'amount',
        type: 3,
        description: 'Amount of money to deposit',
        required: true,
    }],
    async execute(client, message, args) {
        let db = client.db;
        const user = await db.get(`user_${message.author.id}`);
        if(!user) {
            await db.set(`user_${message.author.id}`, { balance: 0, bank: 0 });
        }
        let amount = args[0];
        if(!amount) return message.reply({ content: `${client.config.deny} | Please specify an amount to deposit!`, allowedMentions: { repliedUser: false } });
        if(amount.toLowerCase() == 'all') {
            amount = user.balance
        } else {
            amount = parseInt(amount);
        }
        if(amount < 0) return message.reply({ content: `${client.config.deny} | You can't deposit negative money!`, allowedMentions: { repliedUser: false } });
        if(amount > user.balance) return message.reply({ content: `${client.config.deny} | You don't have that much money!`, allowedMentions: { repliedUser: false } });
        await db.subtract(`user_${message.author.id}.balance`, amount);
        await db.add(`user_${message.author.id}.bank`, amount);
        let settings = await db.get(`user_${message.author.id}.settings`);
        if(!settings) {
            settings = {
                messageType: 'embed',
                color: client.config.embedColor,
            }
        }
        if(settings.messageType === 'text') {
            return message.reply({ content: textMessage.Text_deposit(amount), allowedMentions: { repliedUser: false } });
        } else if(settings.messageType === 'embed') {
            return message.reply({ embeds: [embed.Embed_deposit(amount)], allowedMentions: { repliedUser: false } });
        }
    },
    async slashExecute(client, interaction) {
        let db = client.db;
        const user = await db.get(`user_${interaction.user.id}`);
        if(!user) {
            await db.set(`user_${interaction.user.id}`, { balance: 0, bank: 0 });
        }
        let amount = interaction.options.get('amount').value;
        if(!amount) return interaction.reply({ content: `${client.config.deny} | Please specify an amount to deposit!`, ephemeral: true });
        if(amount.toLowerCase() == 'all') {
            amount = user.balance
        } else {
            amount = parseInt(amount);
        }
        if(amount < 0) return interaction.reply({ content: `${client.config.deny} | You can't deposit negative money!`, ephemeral: true });
        if(amount > user.balance) return interaction.reply({ content: `${client.config.deny} | You don't have that much money!`, ephemeral: true });
        await db.subtract(`user_${interaction.user.id}.balance`, amount);
        await db.add(`user_${interaction.user.id}.bank`, amount);
        interaction.reply({ embeds: [embed.Embed_deposit(amount)], ephemeral: true });
    },
}