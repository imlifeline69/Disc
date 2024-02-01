const dotenv = require('dotenv');
const Discord = require('discord.js');
const { deposit } = require('discord-mongoose-economy');

dotenv.config();
const ENV = process.env;

const github = 'https://github.com/imLifeline/Disc';
const bot_version = require('../../package.json').version;

const emotes = {
    react: "<a:gaynod:1190346081133936782>",
    currency: "",
    deny: "<a:NO:1193614076023144619>",
    approve: "<a:Yes:1193614234400084068>",
    accept: "<a:Yes:1193614234400084068>",
    what: "<:whatwhat:1039206140296302592>"
}

const bot_name = typeof (process.env.BOT_NAME) === 'undefined' ? 'Big PP' : (ENV.BOT_NAME);
const color = typeof (process.env.EMBEDS_COLOR) === 'undefined' ? '#6f6fff' : (ENV.EMBEDS_COLOR);
const approve = typeof (emotes.approve) === 'undefined' ? '✅' : (emotes.approve);
const deny = typeof (emotes.deny) === 'undefined' ? '❌' : (emotes.deny);



module.exports = {
    Text_dashboard: function (status, music_title, music_url, music_thumbnail, music_description, music_requester) {
        const Text_dashboard = new Discord.EmbedBuilder()
            .setAuthor({ name: music_requester.username, iconURL: music_requester.avatarURL() })
            .setColor(color)
            .setTitle(music_title)
            .setURL(music_url)
            .setThumbnail(music_thumbnail)
            .addFields({ name: status, value: music_description })
            .setTimestamp()
        return Text_dashboard;
    },

    Text_add: function (status, music_title, music_url, music_thumbnail, music_author, music_length, music_requester) {
        const Text_add = new Discord.EmbedBuilder()
            .setAuthor({ name: music_requester.username, iconURL: music_requester.avatarURL() })
            .setColor(color)
            .setTitle(music_title)
            .setURL(music_url)
            .setThumbnail(music_thumbnail)
            .addFields({ name: status, value: `Author : **${music_author}**\nDuration **${music_length}**`, inline: true })
            .setTimestamp()
        return Text_add;
    },

    Text_queue: function (status, nowplay, queueMsg, loopStatus) {
        const Text_queue = new Discord.EmbedBuilder()
            .setColor(color)
            .setTitle(status)
            .addFields({ name: nowplay, value: queueMsg })
            .setTimestamp()
            .setFooter({ text: `Loop: ${loopStatus}` });
        return Text_queue;
    },

    Text_remove: function (status, music_title) {
        const Text_remove = new Discord.EmbedBuilder()
            .setColor(color)
            .setTitle(status)
            .setDescription(`${music_title}`)
            .setTimestamp()
        return Text_remove;
    },

    Text_save: function (music_title, music_url, music_thumbnail, description) {
        const Text_queue = new Discord.EmbedBuilder()
            .setColor(color)
            .setTitle(music_title)
            .setURL(music_url)
            .setThumbnail(music_thumbnail)
            .setDescription(description)
            .setTimestamp()
        return Text_queue;
    },

    Text_search: function (music_title, description) {
        const Text_cantFindSong = new Discord.EmbedBuilder()
            .setColor(color)
            .setTitle(music_title)
            .setDescription(description)
            .setTimestamp()
        return Text_cantFindSong;
    },

    Text_help: function (help_title, help_thumbnail, description) {
        const Text_help = new Discord.EmbedBuilder()
            .setColor(color)
            .setTitle(help_title)
            .setURL(github)
            .setThumbnail(help_thumbnail)
            .setDescription(description)
            .setTimestamp()
        return Text_help;
    },

    Text_help2: function (command, description) {
        const Text_help2 = new Discord.EmbedBuilder()
            .setColor(color)
            .setTitle(`Command **${command}**`, '')
            .setDescription(description)
        return Text_help2;
    },

    Text_status: function (uptime, os, node_v, djs_v, cpu, cpu_usage, ram, heap, ping, serverCount) {
        const Text_status = new Discord.EmbedBuilder()
            .setColor(color)
            .setTitle(`${bot_name} v${bot_version}`)
            .setURL(github)
            .setDescription(`**• Serving ${serverCount} servers**\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━`)
            .addFields(
                { name: `⚙️ SYSTEM`, value: `OS : **${os}**\nNode.js : **${node_v}**\nDiscord.js : **${djs_v}**\nCPU : **${cpu}**\nUptime : **${uptime}**\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━`, inline: false },
                { name: `📊 USAGE`, value: `CPU : **${cpu_usage}**\nRam : **${ram}**\nHeap : **${heap}**\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━`, inline: false },
                { name: `🛰️ LATENCY`, value: `Bot : **${ping.bot}**\nAPI : **${ping.api}ms**`, inline: false }
            )
            .setTimestamp()
        return Text_status;
    },

    Text_server: function (serverlist) {
        const Text_server = new Discord.EmbedBuilder()
            .setColor(color)
            .setTitle(`Servers that have **${bot_name}**`, '')
            .setDescription(serverlist)
        return Text_server;
    },

    Text_ping: function (bot, api) {
        const Text_ping = new Discord.EmbedBuilder()
            .setColor(color)
            .setTitle('🛰️ LATENCY')
            .setDescription(`Bot : **${bot}**\nAPI : **${api}ms**`)
        return Text_ping;
    },

    Text_connect: function () {
        const Text_connect = new Discord.EmbedBuilder()
            .setColor(color)
            .setDescription('Voice channel connected successfully.')
        return Text_connect;
    },
    Text_disconnect: function () {
        const Text_disconnect = new Discord.EmbedBuilder()
            .setColor(color)
            .setDescription('Finished playing.')
            
        return Text_disconnect;
    },
    Text_balance: function (user, balance, bank) {
        balanceHeader = `>>> **${user.username}'s Balance**\n\n`;
        balanceDetails = `Cash: **${balance}**\nBank: **${bank}**`
        const Text_balance = balanceHeader + balanceDetails;
        return Text_balance;
    },
    Text_work: function (reward) {
        workHeader = `>>> **Work **\n\n`;
        const Text_work = workHeader + reward;
        return Text_work;
    },
    Text_deposit: function (amount) {
        depositHeader = `>>> **Deposit **\n\n`;
        depositDetails = `Amount: **${amount}**\n${approve} | The transaction was successful!`
        const Text_deposit = depositHeader + depositDetails;
        return Text_deposit;
    },
    Text_withdraw: function (amount) {
        winthdrawHeader = `>>> **Withdraw **\n\n`;
        withdrawDetails = `Amount: **${amount}**\n${approve} | The transaction was successful!`
        const Text_withdraw = withdrawHeader + withdrawDetails;
        return Text_withdraw;
    },
    Text_transfer: function (amount, to, from) {
        tarnsferHeader = `>>> **Transfer **\n\n`;
        transferDetails = `From: **${from}**\nTo: **${to}**\nAmount: **${amount}**\n${approve} | The transaction was successful!
        `
        const Text_transfer = transferHeader + transferDetails;
        return Text_transfer;
    },
    Text_shop_find: function (item) {
        let content = 
        `**${item.custom.emoji} ${item.name}** - Item Info:\n\n` +

        `Name: ${item.name}` +
        `${item.custom.locked ? ` [🔒 | Locked since ${new Date(item.custom.lockedSince)
            .toLocaleString()}]` : ''}\n` +

        `ID: **${item.id}**\n` +
        `Emoji: ${item.custom.emoji}\n\n` +

        `Price: **${item.price}** coins\n` +
        `Description: **${item.description}**\n` +
        `Max quantity in inventory: **${item.maxAmount}**\n\n` +

        `${item.role ? `Role: **<@&${item.role}>**\n` : ''}` +
        `Hidden: **${item.custom.hidden ? 'Yes' : 'No'}**\n` +
        `Locked: **${item.custom.locked ? 'Yes' : 'No'}**\n\n` +

        `Message on use: **${item.message}**\n` +
        `Created at: **${item.date}**`
        const Text_shop = new Discord.EmbedBuilder()
            .setAuthor({ name: 'Item Info'})
            .setColor(color)
            .setDescription(content)
            .setTimestamp()
        return Text_shop;
    },
    Text_shop: function (itemList) {
        const Text_shop = new Discord.EmbedBuilder()
            .setAuthor({ name: 'Shop'})
            .setColor(color)
            .setDescription(itemList)
            .setTimestamp()
        return Text_shop;
    },
    Text_shop_buy: function (item, amount) {
        const Text_shop_buy = new Discord.EmbedBuilder()
            .setAuthor({ name: 'Buy'})
            .setColor(color)
            .setDescription(`You bought **${amount}** ${item.emoji} ${item.name} for **${item.price * amount}** coins!`)
            .setTimestamp()
        return Text_shop_buy;
    },
    Text_shop_sell: function (item, amount) {
        const Text_shop_sell = new Discord.EmbedBuilder()
            .setAuthor({ name: 'Sell'})
            .setColor(color)
            .setDescription(`You sold **${amount}** ${item.emoji} ${item.name} for **${amount}** coins!`)
            .setTimestamp()
        return Text_shop_sell;
    },
    Text_inventory: function (user, inventory) {
        let inventoryHeader = `>>> **${user.username}'s Inventory**\n\n`;
        const Text_inventory =  inventoryHeader + inventory;
        return Text_inventory;
    },
}