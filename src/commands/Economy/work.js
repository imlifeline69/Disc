const embed = require('../../embeds/embeds.js');
const textMessage = require('../../embeds/textMessage.js');
const { economyConfig, workRandom, randomWorker, workMessage } = require('../../utils/economy.js');
const ms = require('ms');
module.exports = {
    name: 'work',
    aliases: ['w'],
    description: 'Work and earn coins!',
    usage: 'work',
    category: 'Economy',
    options: [],

    async execute(client, message) {
        let db = client.db;
        const user = await db.get(`user_${message.author.id}`);
        let cooldown = await db.get(`user_${message.author.id}.cooldown.work`);
        if(cooldown !== null && economyConfig.workCooldown - (Date.now() - cooldown) > 0) {
            let timeObj = ms(economyConfig.workCooldown - (Date.now() - cooldown));
            let time = `${timeObj.seconds}s`;
            return message.reply({ content: `${client.config.deny} | You can work again in **${time}**`, allowedMentions: { repliedUser: false } });
        }
        await db.set(`user_${message.author.id}.cooldown.work`, Date.now());
        if(!user) {
            await db.set(`user_${message.author.id}`, { balance: 0, bank: 0 });
        }
        const ec = economyConfig;
        let workReward = workRandom(ec.workAmount[0], ec.workAmount[1]);
        await db.add(`user_${message.author.id}.balance`, workReward);
        worker = randomWorker();
        work = workMessage(workReward, worker)
        let settings = await db.get(`user_${message.author.id}.settings`);
        if(!settings) {
            settings = {
                messageType: 'embed',
                color: client.config.embedColor,
            }
        }
        if(settings.messageType === 'text') {
            return message.reply({ content: textMessage.Text_work(work), allowedMentions: { repliedUser: false } });
        } else if(settings.messageType === 'embed') {
            return message.reply({ embeds: [embed.Embed_work(work)], allowedMentions: { repliedUser: false } });
        }
    },
    async slashExecute(client, interaction) {
        let db = client.db;
        const user = await db.get(`user_${interaction.user.id}`);
        let cooldown = await db.get(`user_${interaction.user.id}.cooldown.work`);
        if(cooldown !== null && economyConfig.workCooldown - (Date.now() - cooldown) > 0) {
            let timeObj = ms(economyConfig.workCooldown - (Date.now() - cooldown));
            let time = `${timeObj.seconds}s`;
            return interaction.reply({ content: `${client.config.deny} | You can work again in **${time}**`, allowedMentions: { repliedUser: false } });
        }
        await db.set(`user_${interaction.user.id}.cooldown.work`, Date.now());
        if(!user) {
            await db.set(`user_${interaction.user.id}`, { balance: 0, bank: 0 });
        }
        const ec = economyConfig;
        let workReward = workRandom(ec.workAmount[0], ec.workAmount[1]);
        await db.add(`user_${interaction.user.id}.balance`, workReward);
        worker = randomWorker();
        work = workMessage(workReward, worker)
        let settings = await db.get(`user_${interaction.user.id}.settings`);
        if(!settings) {
            settings = {
                messageType: 'embed',
                color: client.config.embedColor,
            }
        }
        if(settings.messageType === 'text') {
            return interaction.reply({ content: textMessage.Text_work(work), allowedMentions: { repliedUser: false } });
        } else if(settings.messageType === 'embed') {
            return interaction.reply({ embeds: [embed.Embed_work(work)], allowedMentions: { repliedUser: false } });
        }
    },
}