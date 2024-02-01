const { itemNotInData, noItemGiven, craftITemsNotFound } = require('../../utils/messages.js');

const { getUser, getCraftItems, getItem, checkInventory, getInventory, deductInvQuantity } = require('../../utils/rpgFunctions/user.js');


module.exports = {
    name: 'craft',
    aliases: ['c'],
    description: 'Craft items',
    usage: 'craft <item>',
    category: 'Rpg',
    options: [],

    async execute (client, message, args) {
        let user = await getUser(message.author.id);
        let inv = await getInventory(message.author.id);
        let item = args[0];
        if(!item) return message.reply({ content: noItemGiven, allowedMentions: { repliedUser: false} });
        item = await getItem(item, 'craft')
        if(!item) return message.reply({ content: itemNotInData, allowedMentions: { repliedUser: false } });
        let craftItems = await getCraftItems(item);
        if(!craftItems) return message.reply({ content: craftITemsNotFound, allowedMentions: { repliedUser: false} });
        let itemsNeeded = [];
        // IDK why this for loop works or how this for loop works but it does and ive decided not to touch it and hence work around it
        for (let craftItem of craftItems) {
            let itemInInv = await checkInventory(inv, craftItem);
            if (!itemInInv) {
                itemsNeeded = null
                break;
            } else {
                itemsNeeded.push(itemInInv)
            }
        }
        if (!itemsNeeded) {
            return message.reply({ content: `${client.config.deny} | You do not have all the items required for the craft!`, allowedMentions: {repliedUser: false} })
        } 
        craftItems.forEach(craftItem => {
            deductInvQuantity(message.author.id, craftItem, craftItem.amount)
        });
        return message.reply(`The crafting may commense`)

    }
};