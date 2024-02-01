const embed = require('../../embeds/embeds.js');
const { economyConfig, workRandom, randomWorker, workMessage } = require('../../utils/economy.js');

module.exports = {
    name: 'settings',
    aliases: ['set'],
    description: 'Change your settings!',
    usage: 'settings',
    category: 'Economy',
    options: [
        {
            name: 'set',
            description: 'Set a setting',
            type: 1,
            options: [
                {
                    name: 'message',
                    description: 'Set the message type',
                    type: 3,
                    required: true,
                    choices: [
                        {
                            name: 'Embed',
                            value: 'embed'
                        },
                        {
                            name: 'Text',
                            value: 'text'
                        }
                    ]
                },
                {
                    name: 'color',
                    description: 'Set the color',
                    type: 3,
                    required: false,
                }
            ]
        }
    ],

    async execute(client, message, args) {
        let db = client.db;
        const user = await db.get(`user_${message.author.id}`);
        let options = args[0];
        let availableOptions = ['set', 'view'];
        if(!options) {
            return message.reply({ content: `${client.config.deny} | You need to specify an option!\nAvailable options: \`${availableOptions.join(', ')}\``, allowedMentions: { repliedUser: false } });
        }
        if(!availableOptions.includes(options)) {
            return message.reply({ content: `${client.config.deny} | That is not a valid option!\nAvailable options: \`${availableOptions.join(', ')}\``, allowedMentions: { repliedUser: false } });
        }
        let defaultSettings = {
            messageType: 'embed',
            color: client.config.embedColor,
        }
        let settings = await db.get(`user_${message.author.id}.settings`);
        if(!settings) {
            await db.set(`user_${message.author.id}.settings`, defaultSettings);
        }
        if (options === 'set') {
            let option = args[1];
            let availableOption = [`message`, `color`]
            if(!option) {
                return message.reply({ content: `${client.config.deny} | You need to specify an option!\nAvailable options: \`${availableOption.join(', ')}\``, allowedMentions: { repliedUser: false } });
            }
            option = option.toLowerCase();
            if(option === 'message') {
                let value = args[2];
                let availableMessageTypes = ['embed', 'text'];
                if(!value) {
                    return message.reply({ content: `${client.config.deny} | You need to specify a value!\nAvailable message types: \`embed\`, \`text\``, allowedMentions: { repliedUser: false } });
                }
                value = value.toLowerCase();
                if(!availableMessageTypes.includes(value)) {
                    return message.reply({ content: `${client.config.deny} | That is not a valid message type!\nAvailable message types: \`embed\`, \`text\``, allowedMentions: { repliedUser: false } });
                }
                if(value === 'embed') {
                    await db.set(`user_${message.author.id}.settings.messageType`, 'embed');
                    return message.reply({ content: `${client.config.approve} | Set message type to **Embed**`, allowedMentions: { repliedUser: false } });
                } else if(value === 'text') {
                    await db.set(`user_${message.author.id}.settings.messageType`, 'text');
                    return message.reply({ content: `${client.config.approve} | Set message type to **Text**`, allowedMentions: { repliedUser: false } });
                } else {
                    return message.reply({ content: `${client.config.deny} | That is not a valid message type!\nAvailable message types: \`embed\`, \`text\``, allowedMentions: { repliedUser: false } });
                }
            } else if(option === 'color') {
                let value = args[2];
                if(!value) {
                    return message.reply({ content: `${client.config.deny} | You need to specify a value!\nAvailable options: \`default\`, \`hex\``, allowedMentions: { repliedUser: false } });
                }
                value = value.toLowerCase();
                if(value === 'hex') {
                    let hex = args[3];
                    if(!hex) {
                        return message.reply({ content: `${client.config.deny} | You need to specify a hex code!`, allowedMentions: { repliedUser: false } });
                    }
                    if(hex.length !== 6) {
                        return message.reply({ content: `${client.config.deny} | That is not a valid hex code! It should look something like this: \`ffffff\``, allowedMentions: { repliedUser: false } });
                    }
                    await db.set(`user_${message.author.id}.settings.color`, hex);
                    return message.reply({ content: `${client.config.approve} | Set color to **#${hex}**`, allowedMentions: { repliedUser: false } });
                } else if(value === 'default') {
                    await db.set(`user_${message.author.id}.settings.color`, client.config.embedColor);
                    return message.reply({ content: `${client.config.approve} | Set color to **Default**`, allowedMentions: { repliedUser: false } });
                } else {
                    return message.reply({ content: `${client.config.deny} | That is not a valid option!\nAvailable options: \`default\`, \`hex\``, allowedMentions: { repliedUser: false } });
                }
            } else {
                return message.reply({ content: `${client.config.deny} | That is not a valid option!\nAvailable options: \`${availableOption.join(', ')}\``, allowedMentions: { repliedUser: false } });
            }
        } else if (options === 'view') {
            let settings = await db.get(`user_${message.author.id}.settings`);
            if(!settings) {
                await db.set(`user_${message.author.id}.settings`, defaultSettings);
            }
            let content = `**Message Type:** ${settings.messageType}\n**Color:** ${settings.color}`;
            return message.reply({ content: `${client.config.approve} | Your settings:\n${content}`, allowedMentions: { repliedUser: false } });
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
        interaction.reply({ embeds: [embed.Embed_work(work)], allowedMentions: { repliedUser: false } });
    },
}