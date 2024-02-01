const embed = require('../../embeds/embeds.js');
const textMessage = require('../../embeds/textMessage.js');
const itemData = require('../../utils/items.js');

module.exports = {
    name: 'inventory',
    aliases: ['inv'],
    description: 'Your inventory!',
    usage: 'inventory',
    category: 'Economy',
    options: [
        {
            name: 'view',
            description: 'View your inventory',
            type: 1,
            options: []
        },
        {
            name: 'sort',
            description: 'Sort your inventory',
            type: 1,
            options:[
                {
                    name: 'type',
                    description: 'Type of sort',
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: 'Name',
                            value: 'name'
                        },
                        {
                            name: 'Price',
                            value: 'price'
                        },
                        {
                            name: 'Amount',
                            value: 'amount'
                        }
                    ]
                },
                {
                    name: 'order',
                    description: 'Order of sort',
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: 'Ascending',
                            value: 'asc'
                        },
                        {
                            name: 'Descending',
                            value: 'desc'
                        }
                    ]
                }
            ]
        }
    ],

    async execute(client, message, args) {
        const db = client.db;
        let options = args[0];
        let availableOptions = ['view', 'set', 'sort'];
        let inv = await db.get(`user_${message.author.id}.inventory`);
        if (!inv) {
            await db.set(`user_${message.author.id}.inventory`, []);
            inv = await db.get(`user_${message.author.id}.inventory`);
        }
        let sort = await db.get(`user_${message.author.id}.inventory.sort`);
        if (!sort) {
            await db.set(`user_${message.author.id}.inventory.sort`, 'nameasc');
            sort = await db.get(`user_${message.author.id}.inventory.sort`);
        };
        if (!options) {
            options = 'view';
        }
        if (!availableOptions.includes(options.toLowerCase())) {
            return message.reply({ content: `${client.config.deny} | Please specify a valid option!\nAvailable options: \`${availableOptions.join(', ')}\``, allowedMentions: { repliedUser: false } });
        }
        
        options = options.toLowerCase();
        if(options === 'view') {
            let itemlist = [];
            if(inv.length === 0) {
                return message.reply({ content: `${client.config.deny} | You don't have any items!`, allowedMentions: { repliedUser: false } });
            }
            for(let i = 0; i < inv.length; i++) {
                let item = inv[i];
                if(item.quantity === 0) continue;
                let itemData = {
                    value: item.value,
                    name: item.name,
                    emoji: item.emoji,
                    amount: item.quantity,
                    price: item.price,
                    description: item.description,
                    sellPrice: item.sellPrice,
                }
                itemlist.push(itemData);
            }
            if (sort === 'nameasc') {
                itemlist.sort((a, b) => a.name.localeCompare(b.name));
            } else if (sort === 'namedesc') {
                itemlist.sort((a, b) => b.name.localeCompare(a.name));
            } else if (sort === 'priceasc') {
                itemlist.sort((a, b) => a.price - b.price);
            } else if (sort === 'pricedesc') {
                itemlist.sort((a, b) => b.price - a.price);
            } else if (sort === 'amountasc') {
                itemlist.sort((a, b) => a.amount - b.amount);
            } else if (sort === 'amountdesc') {
                itemlist.sort((a, b) => b.amount - a.amount);
            }
            // Sort order Debug
            // message.reply({ content: `${sort}`, allowedMentions: { repliedUser: false } }); 
            
            if(itemlist.length === 0) {
                return message.reply({ content: `${client.config.deny} | You don't have any items!`, allowedMentions: { repliedUser: false } });
            }
            let invDesc = '';
            itemlist.forEach(item => {
                invDesc += `${item.value} - ${item.emoji} ${item.name} - **${item.amount}**\n`;
            });
           
            //message.reply({ content: `${JSON.stringify(itemlist)}`, allowedMentions: { repliedUser: false } }); //Debug
            
            let settings = await db.get(`user_${message.author.id}.settings`);
            if(!settings) {
                settings = {
                    messageType: 'embed',
                    color: client.config.embedColor,
                }
            }
            if(settings.messageType === 'embed') {
                message.reply({ embeds: [embed.Embed_inventory(invDesc)], allowedMentions: { repliedUser: false } });
            } else if (settings.messageType === 'text') {
                return message.reply({ content: textMessage.Text_inventory(message.author, invDesc), allowedMentions: { repliedUser: false } });
            }

        } else if (options === 'sort'){
            let type = args[1];
            let order = args[2];
            let availableTypes = ['name', 'price', 'amount'];
            let availableOrders = ['asc', 'desc'];
            if(!type) {
                type = 'name';
            }
            if(!order) {
                order = 'asc';
            }
            type = type.toLowerCase();
            
            if(type === 'name') {
                if(order === 'asc') {
                    // Ascending
                    await db.set(`user_${message.author.id}.inventory.sort`, `nameasc`);
                    return message.reply({ content: `${client.config.accept} | Set your inventory sort to be Name - Ascending`, allowedMentions: { repliedUser: false } });

                } else if (order === 'desc') {
                    // Descending
                    await db.set(`user_${message.author.id}.inventory.sort`, `namedesc`);
                    return message.reply({ content: `${client.config.accept} | Set your inventory sort to be Name - Descending`, allowedMentions: { repliedUser: false } });
                } else {
                    return message.reply({ content: `${client.config.deny} | Please specify a valid order!\nAvailable orders: \`${availableOrders.join(', ')}\``, allowedMentions: { repliedUser: false } });
                }
            } else if (type === 'price') {
                if(order === 'asc') {
                    // Ascending
                    await db.set(`user_${message.author.id}.inventory.sort`, `priceasc`);
                    return message.reply({ content: `${client.config.accept} | Set your inventory sort to be Price - Ascending`, allowedMentions: { repliedUser: false } });
                } else if (order === 'desc') {
                    // Descending
                   await db.set(`user_${message.author.id}.inventory.sort`, `pricedesc`);
                    return message.reply({ content: `${client.config.accept} | Set your inventory sort to be Price - Descending`, allowedMentions: { repliedUser: false } });
                } else {
                    return message.reply({ content: `${client.config.deny} | Please specify a valid order!\nAvailable orders: \`${availableOrders.join(', ')}\``, allowedMentions: { repliedUser: false } });
                }
            } else if (type === 'amount') {
                if(order === 'asc') {
                    // Ascending
                    await db.set(`user_${message.author.id}.inventory.sort`, `amountasc`);
                    return message.reply({ content: `${client.config.accept} | Set your inventory sort to be Amount - Ascending`, allowedMentions: { repliedUser: false } });
                } else if (order === 'desc') {
                    // Descending
                    await db.set(`user_${message.author.id}.inventory.sort`, `amountdesc`);
                    return message.reply({ content: `${client.config.accept} | Set your inventory sort to be Amount - Descending`, allowedMentions: { repliedUser: false } });
                } else {
                    return message.reply({ content: `${client.config.deny} | Please specify a valid order!\nAvailable orders: \`${availableOrders.join(', ')}\``, allowedMentions: { repliedUser: false } });
                }
            } else {
                return message.reply({ content: `${client.config.deny} | Please specify a valid type!\nAvailable types: \`${availableTypes.join(', ')}\``, allowedMentions: { repliedUser: false } });
            }
        } else if (options === 'set') {
            let inv = {};
            inv.sort = 'nameasc';
            await client.db.set(`user_${message.author.id}.inventory`, inv);
            message.reply({ content: `Set inventory to default!`, allowedMentions: { repliedUser: false } });
        }
    },
    async slashExecute(client, interaction) {},
};