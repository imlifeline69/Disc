const _eval = require("@moscowcity/djs-eval");
const Eval = new _eval.Eval(["552998962055872515"], "ru");
const { getUser, getInventory, getSettings, getPickaxe, getOres, getOre, getCraftItems, getCraftItem, getCraftItemAmount, getCraftItemName, getCraftItemValue, checkInventory, checkIfCraftAble } = require('../../utils/rpgFunctions/user');
module.exports = {
    name: 'eval',
    aliases: ['ev'],
    description: 'Eval',
    usage: 'eval',
    category: 'Owner',
    voiceChannel: false,
    options: [],

    async execute(client, message) {
        const code = message.content.split(' ').slice(1).join(' ');
        if (!code) return message.reply({ content: 'No code provided', allowedMentions: { repliedUser: false } });
        let db = client.db;
        const userData = await db.get(`user_${message.author.id}`);
        const invData = await db.get(`user_${message.author.id}.inventory`);
        const shopData = await db.get(`shop`);
        const evaled = await Eval.run(message, { client: client, config: client.config, user: userData, shop: shopData, code: code });
        message.channel.send({ content: '```JS\n' + evaled + '```'}); // or message.reply('```JS\n' + evaulated + '```');
    },
    slashExecute(client, interaction) {
        const botPing = `${Date.now() - interaction.createdTimestamp}ms`;
        interaction.reply({ embeds: [embed.Embed_ping(botPing, client.ws.ping)], allowedMentions: { repliedUser: false } });
    },
}