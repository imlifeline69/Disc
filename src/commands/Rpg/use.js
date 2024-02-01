const embeds = require('../../embeds/embeds.js')
const textMessage = require('../../embeds/textMessage.js')

const { craftItems } = require('../../utils/items.js')
const { equipedItem, noItem, itemNotUseable, noItemGiven } = require('../../utils/messages.js')

module.exports = {
    name: 'use',
    aliases: ['u'],
    description: 'Use an item from ur inventory!',
    usage: 'use <item>',
    category: 'Rpg',
    options: [],

    async execute (client, message, args) {
        let db = client.db;
        let usr = `user_${message.author.id}`;
        let user = await db.get(usr);
        let inv = await db.get(`${usr}.inventory`);

        if (!user) {
            await db.set(usr, { balance: 0, bank: 0, inventory: [], settings: { messageType: 'embed', color: client.config.embedColor } });
            user = await db.get(usr);
        }

        let settings = user.settings ? user.settings : { messageType: 'embed', color: client.config.embedColor };

        let item = args[0];
        if(!item) return message.reply({ content: noItemGiven, allowedMentions: { repliedUser: false }});
        item = item.toLowerCase();
        let itemData = inv.find(i => i.value === item || i.alias.includes(item));
        if(!itemData) return message.reply({ content: noItem, allowedMentions: { repliedUser: false }});
        if(!itemData.useAble) return message.reply({ content: itemNotUseable, allowedMentions: { repliedUser: false }});
        if(itemData.quantity <= 0) return message.reply({ content: noItem, allowedMentions: { repliedUser: false }});
        if(itemData.type === 'pickaxe') {
            await db.set(`${usr}.current.pickaxe`, itemData);
            itemData.quantity -= 1;
            await db.set(`${usr}.inventory`, inv);
            return message.reply({ content: `${equipedItem} ${itemData.name}!`, allowedMentions: { repliedUser: false }});
        }
        if(itemData.type === 'axe') {
            await db.set(`${usr}.current.axe`, itemData);
            itemData.quantity -= 1;
            await db.set(`${usr}.inventory`, inv);
            return message.reply({ content: `${equipedItem} ${itemData.name}!`, allowedMentions: { repliedUser: false }});
        }

    },
    async slashExecute (client, interaction) {},

}