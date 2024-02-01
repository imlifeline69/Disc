const embed = require('../../embeds/embeds.js');
const textMessage = require('../../embeds/textMessage.js');
const items = require('../../utils/items.js');
let itemChoices = [];

for(let i = 0; i < items.items.length; i++) {
    itemChoices.push({
        name: items.items[i].name,
        value: items.items[i].value
    });
}

module.exports = {
    name: 'shop',
    aliases: ['sh'],
    description: 'The shop!',
    usage: 'shop',
    category: 'Economy',
    options: [
        {
            name: 'buy',
            description: 'Buy an item from the shop',
            type: 1,
            options: [
                {
                    name: 'item',
                    description: 'Item to buy',
                    type: 3,
                    required: true,
                    choices: itemChoices
                },
                {
                    name: 'amount',
                    description: 'Amount of items to buy',
                    type: 4,
                    required: false
                }
            ]
        },
        {
            name: 'sell',
            description: 'Sell an item from the shop',
            type: 1,
            options: [
                {
                    name: 'item',
                    description: 'Item to sell',
                    type: 3,
                    required: true,
                    choices: itemChoices
                },
                {
                    name: 'amount',
                    description: 'Amount of items to sell',
                    type: 4,
                    required: false
                }
            ]
        },
        {
            name: 'info',
            description: 'Get info about an item from the shop',
            type: 1,
            options: [
                {
                    name: 'item',
                    description: 'Item to find',
                    type: 3,
                    required: true,
                    choices: itemChoices
                }
            ]
        }
    ],

    async execute(client, message, args) {
        let options = args[0];
        let db = client.db;
        const user = await db.get(`user_${message.author.id}`);
        const shop = await db.get(`shop`);
        const dbUser = `user_${message.author.id}`
        if(!user) {
            await db.set(`${dbUser}`, { balance: 0, bank: 0 });
        }
        itemsData = items.items;
        let itemList = shop;
        if (!itemList) {
            itemList = [];
            await db.set(`shop`, itemsData);
        }
        let shopDesc = '';
        for(let i = 0; i < itemList.length; i++) {
            shopDesc += `${itemList[i].name} - ${itemList[i].value} - ${itemList[i].price} - ${itemList[i].emoji} \n`;
        }
        if(!options) {
            message.reply({ embeds: [embed.Embed_shop(shopDesc)], allowedMentions: { repliedUser: false } });
        }
        options = options.toLowerCase();
        if(options === 'buy') {
            let item = args[1];
            
            if(!item) return message.reply({ content: `${client.config.deny} | Please specify an item to buy!`, allowedMentions: { repliedUser: false } });
            if(item.toLowerCase() === 'all') return message.reply({ content: `${client.config.what} what`, allowedMentions: { repliedUser: false } });
            item = item.toLowerCase();
            let amount = args[2];
            if(!amount) {
                amount = 1;
            } else {
                amount = parseInt(amount);
            }
            if(amount <= 0) return message.reply({ content: `${client.config.deny} | You can't buy negative items!`, allowedMentions: { repliedUser: false } });

            let itemData = shop.find(obj => obj.value.toLowerCase() === item)
            if(!itemData) {
                itemData = shop.find(obj => obj.alias.includes(item));
            }
            if(!itemData) return message.reply({ content: `${client.config.deny} | That item doesn't exist!`, allowedMentions: { repliedUser: false } });

            if(itemData.maxAmount < amount) return message.reply({ content: `${client.config.deny} | You can't buy more than ${itemData.maxAmount} of that item!`, allowedMentions: { repliedUser: false } });
            let userBalance = await db.get(`${dbUser}.balance`);
            if(userBalance < itemData.price * amount) {
                let userBank = await db.get(`${dbUser}.bank`);
                if(userBank >= itemData.price * amount) {
                    message.reply({ content: `You have enough coins in your bank, would you like to withdraw and buy the item?\nType: \`yes\` if you wish to do so!`, allowedMentions: { repliedUser: false } }).then(async msg => {
                        let filter = m => m.author.id === message.author.id;
                        let collector = msg.channel.createMessageCollector({ filter, time: 15000 });
                        collector.on('collect', async m => {
                            if(m.content.toLowerCase() === 'yes') {
                                await db.subtract(`${dbUser}.bank`, itemData.price * amount);
                                let userInventory = await db.get(`${dbUser}.inventory`);
                                if(!userInventory) {
                                    userInventory = [];
                                    await db.set(`${dbUser}.inventory`, userInventory);
                                }
                                let userItem = userInventory.find(obj => obj.value === itemData.value);
                                if(userItem) {
                                    userItem.quantity += amount;
                                    await db.set(`${dbUser}.inventory`, userInventory);
                                } else {
                                    itemData.quantity = amount;
                                    userInventory.push(itemData);
                                    await db.set(`${dbUser}.inventory`, userInventory);
                                }
                                return message.reply({ embeds: [embed.Embed_shop_buy(itemData, amount)], allowedMentions: { repliedUser: false } });
                            } else if (m.content.toLowerCase() === 'no') {
                                return message.reply({ content: `${client.config.deny} | Ok, I won't withdraw the money!`, allowedMentions: { repliedUser: false } });
                            }
                        });
                    })
                } else {
                    return message.reply({ content: `${client.config.deny} | You don't have enough money! The item costs ${itemData.price} coins!`, allowedMentions: { repliedUser: false } });
                }
            } else {
                let userInventory = await db.get(`${dbUser}.inventory`);
                if(!userInventory) {
                    userInventory = [];
                    await db.set(`${dbUser}.inventory`, userInventory);
                }
                let userItem = userInventory.find(obj => obj.value === itemData.value);
                if(userItem) {
                    userItem.quantity += amount;
                    await db.set(`${dbUser}.inventory`, userInventory);
                } else {
                    itemData.quantity = amount;
                    userInventory.push(itemData);
                    await db.set(`${dbUser}.inventory`, userInventory);
                }
                await db.set(`${dbUser}.balance`, userBalance - itemData.price * amount);
                message.reply({ embeds: [embed.Embed_shop_buy(itemData, amount)], allowedMentions: { repliedUser: false } });
            }
        } else if(options=== 'sell') {
            let item = args[1];
            if(!item) return message.reply({ content: `${client.config.deny} | Please specify an item to sell!`, allowedMentions: { repliedUser: false } });
            if(item.toLowerCase() === 'all') return message.reply({ content: `${client.config.what} what`, allowedMentions: { repliedUser: false } });
            item = item.toLowerCase();
            let amount = args[2];
            if(!amount) {
                amount = 1;
            } else {
                if (isNaN(amount)) return message.reply({ content: `${client.config.deny} | Please specify a valid amount!`, allowedMentions: { repliedUser: false } });
                amount = parseInt(amount);
            }
            if(amount < 0) return message.reply({ content: `${client.config.deny} | You can't sell negative items!`, allowedMentions: { repliedUser: false } });
            let inv = await db.get(`${dbUser}.inventory`);
            if(!inv) return message.reply({ content: `${client.config.deny} | You don't have any items!`, allowedMentions: { repliedUser: false } });
            let invItems = inv.map(obj => obj.value.toLowerCase());
            if(!invItems.includes(item)) return message.reply({ content: `${client.config.deny} | You don't have that item!`, allowedMentions: { repliedUser: false } });
            let itemData = inv.find(obj => obj.value.toLowerCase() === item);
            if(itemData.quantity < amount) return message.reply({ content: `${client.config.deny} | You don't have enough items!`, allowedMentions: { repliedUser: false } });
            let sellAble = itemData.sellAble;
            if(!sellAble) return message.reply({ content: `${client.config.deny} | You can't sell that item!`, allowedMentions: { repliedUser: false } });
            let sellPrice = itemData.sellPrice;
            if (!sellPrice) return message.reply({ content: `${client.config.deny} | This item doesnt have a sell pirce for some reason!`, allowedMentions: { repliedUser: false } });

            await db.add(`${dbUser}.balance`, sellPrice * amount);
            itemData.quantity -= amount;

            await db.set(`${dbUser}.inventory`, inv);
            
            message.reply({ embeds: [embed.Embed_shop_sell(itemData.item, amount, sellPrice * amount)], allowedMentions: { repliedUser: false } });
            // return message.reply({ content: `${JSON.stringify(inv)}`, allowedMentions: { repliedUser: false} }); //Debug for inv after lowering item quantity
            // return message.reply({ content: `${JSON.stringify(itemData.quantity)}`, allowedMentions: { repliedUser: false } }); //Debug for itemData
            
        } else if(options === 'info') {
            return message.reply({ content: `${client.config.deny} | This feature is not available yet!`, allowedMentions: { repliedUser: false } });
        } else if (options === 'set') {
            await db.set(`shop`, itemsData);
            message.reply({ content: `${client.config.approve} | Set the default!`, allowedMentions: { repliedUser: false } });
        } else {
            message.reply({ embeds: [embed.Embed_shop(shopDesc)], allowedMentions: { repliedUser: false } });
        }
    },
    async slashExecute(client, interaction) {},
}