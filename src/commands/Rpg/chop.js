const embeds = require('../../embeds/embeds.js')
const textMessage = require('../../embeds/textMessage.js')

const { wooden } = require('../../utils/items.js')
const { noAxe } = require('../../utils/messages.js')

const { randomAmount, randomPrice, randomWood } = require('../../utils/rpgFunctions/randomItems.js')
const { getUser } = require('../../utils/rpgFunctions/user.js')

module.exports = {
    name: 'chop',
    aliases: ['ch'],
    description: 'Chop them trees',
    usage: 'chop',
    category: 'Rpg',
    options: [],

    async execute (client, message, args) {
        let db = client.db;
        let usr = `user_${message.author.id}`
        let user = await getUser(message.author.id);

        // let axe = {
        //     name: 'Wooden Axe',
        //     value: 'wa',
        //     alias: ['wooden-axe', 'woodenaxe'],
        //     sellPrice: 75,
        //     sellAble: false,
        //     useAble: true,
        //     craftAble: true,
        //     maxAmount: 1,
        //     emoji: ' ',
        //     quantity: 0,
        //     description: 'A wooden axe',
        //     type: 'axe',
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
        //             type: 'wooden'
        //         },
        //         {
        //             name: 'Stick',
        //             value: 'stick',
        //             amount: 2,
        //             type: 'wooden'
        //         }
        //     ],
        // }
        // await db.set(`user_${message.author.id}.inventory.current.axe`, axe)
        // return
        
        let settings = user.settings ? user.settings : { messageType: 'embed', color: client.config.embedColor };
        let axe = user.inventory.current.axe;
        if (!axe) { 
            return message.reply({ content: noAxe, allowedMentions: { repliedUser: false } });
        }

        let choppedWood = randomWood(axe.stats);
        let choppedAmount = randomAmount(choppedWood);
        let choppedPrice = randomPrice(choppedWood);

        let chopped = {
            name: choppedWood.name,
            value: choppedWood.value,
            emoji: choppedWood.emoji,
            rarity: choppedWood.rarity,
            price: choppedPrice,
            quantity: choppedAmount,
            description: choppedWood.description,
            type: 'wood',
        }
        
        let wooden = user.inventory.wooden ? user.inventory.wooden : [];
        let wood = wooden.find(o => o.value === chopped.value);
        if (wood) {
            wood.quantity += chopped.quantity;
            wood.price += chopped.price * chopped.quantity;
        } else {
            wooden.push(chopped);
        }
        await db.set(`${usr}.inventory.wooden`, wooden);
        let durability = axe.stats.durability - chopped.quantity;
        if(durability <= 0) {
            await db.set(`${usr}.inventory.current.axe`, null);
            return message.channel.send({ content: 'Your axe has broken!', allowedMentions: { repliedUser: false }})
        }
        await db.set(`${usr}.inventory.current.axe.stats.durability`, axe.stats.durability - chopped.quantity);

        return message.channel.send({ content: chopped.name + ' ' + chopped.emoji + ' | ' + chopped.quantity + ' ' + chopped.name + ' ' + chopped.emoji + ' have been added to your inventory!', allowedMentions: { repliedUser: false }})
    },
    async slashExecute (client, interaction) {},

}
