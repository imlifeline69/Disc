const embeds = require('../../embeds/embeds.js')
const textMessage = require('../../embeds/textMessage.js')

const { ores } = require('../../utils/items.js')
const { noPickaxe } = require('../../utils/messages.js')

const { randomAmount, randomPrice, randomOre } = require('../../utils/rpgFunctions/randomItems.js')

module.exports = {
    name: 'mine',
    aliases: ['m'],
    description: 'Mine for resources',
    usage: 'mine',
    category: 'Rpg',
    options: [],

    async execute (client, message, args) {
        let db = client.db;
        let usr = `user_${message.author.id}`;
        let user = await db.get(usr);

        if (!user) {
            await db.set(usr, { balance: 0, bank: 0, inventory: {}, settings: { messageType: 'embed', color: client.config.embedColor } });
            user = await db.get(usr);
        }
        // let pick = {
        //     name: 'Wooden Pickaxe',
        //     value: 'wp',
        //     alias: ['wooden-pickaxe', 'woodenpickaxe'],
        //     sellPrice: 75,
        //     sellAble: false,
        //     useAble: true,
        //     craftAble: true,
        //     maxAmount: 1,
        //     emoji: ' ',
        //     quantity: 0,
        //     description: 'A wooden pickaxe',
        //     type: 'pickaxe',
        //     stats: {
        //         power: 1,
        //         durability: 50,
        //         range: 1
        //     },
        //     craftItems: [
        //         {
        //             name: 'Wood',
        //             value: 'wood',
        //             amount: 5,
        //         },
        //         {
        //             name: 'Stick',
        //             value: 'stick',
        //             amount: 2,
        //         }
        //     ],
        // }

        // await db.set(`user_${message.author.id}.inventory.current.pickaxe`, pick)

        let settings = user.settings ? user.settings : { messageType: 'embed', color: client.config.embedColor };
        let pickaxe = user.inventory.current.pickaxe;
        if (!pickaxe) { 
            return message.reply({ content: noPickaxe, allowedMentions: { repliedUser: false } });
        }

        let minedOre = randomOre(pickaxe.stats);
        let minedAmount = randomAmount(minedOre);
        let minedPrice = randomPrice(minedOre);

        let mined = {
            name: minedOre.name,
            value: minedOre.value,
            emoji: minedOre.emoji,
            rarity: minedOre.rarity,
            price: minedPrice,
            quantity: minedAmount,
            description: minedOre.description,
            type: 'ore',
        }
        
        let ores = user.inventory.ores ? user.inventory.ores : [];
        let ore = ores.find(o => o.value === mined.value);
        if (ore) {
            ore.quantity += mined.quantity;
            ore.price += mined.price * mined.quantity;
        } else {
            ores.push(mined);
        }
        await db.set(`${usr}.inventory.ores`, ores);
        let durability = pickaxe.stats.durability - mined.quantity;
        if(durability <= 0) {
            await db.set(`${usr}.inventory.current.pickaxe`, null);
            return message.channel.send({ content: 'Your pickaxe has broken!', allowedMentions: { repliedUser: false }})
        }
        await db.set(`${usr}.inventory.current.pickaxe.stats.durability`, pickaxe.stats.durability - mined.quantity);

        return message.channel.send({ content: mined.name + ' ' + mined.emoji + ' | ' + mined.quantity + ' ' + mined.name + ' ' + mined.emoji + ' have been added to your inventory!', allowedMentions: { repliedUser: false }})
    },
    async slashExecute (client, interaction) {},

}
