const dotenv = require('dotenv');
const Discord = require('discord.js');

dotenv.config();
const ENV = process.env;

const github = 'https://github.com/imLifeline/Disc';
const bot_version = require('../../package.json').version;

const bot_name = typeof (process.env.BOT_NAME) === 'undefined' ? 'Big PP' : (ENV.BOT_NAME);
const color = typeof (process.env.EMBEDS_COLOR) === 'undefined' ? '#6f6fff' : (ENV.EMBEDS_COLOR);


module.exports = {
    Embed_dashboard: function (status, music_title, music_url, music_thumbnail, music_description, music_requester) {
        const Embed_dashboard = new Discord.EmbedBuilder()
            .setAuthor({ name: music_requester.username, iconURL: music_requester.avatarURL() })
            .setColor(color)
            .setTitle(music_title)
            .setURL(music_url)
            .setThumbnail(music_thumbnail)
            .addFields({ name: status, value: music_description })
            .setTimestamp()
        return Embed_dashboard;
    },

    Embed_add: function (status, music_title, music_url, music_thumbnail, music_author, music_length, music_requester) {
        const Embed_add = new Discord.EmbedBuilder()
            .setAuthor({ name: music_requester.username, iconURL: music_requester.avatarURL() })
            .setColor(color)
            .setTitle(music_title)
            .setURL(music_url)
            .setThumbnail(music_thumbnail)
            .addFields({ name: status, value: `Author : **${music_author}**\nDuration **${music_length}**`, inline: true })
            .setTimestamp()
        return Embed_add;
    },

    Embed_queue: function (status, nowplay, queueMsg, loopStatus) {
        const Embed_queue = new Discord.EmbedBuilder()
            .setColor(color)
            .setTitle(status)
            .addFields({ name: nowplay, value: queueMsg })
            .setTimestamp()
            .setFooter({ text: `Loop: ${loopStatus}` });
        return Embed_queue;
    },

    Embed_remove: function (status, music_title) {
        const Embed_remove = new Discord.EmbedBuilder()
            .setColor(color)
            .setTitle(status)
            .setDescription(`${music_title}`)
            .setTimestamp()
        return Embed_remove;
    },

    Embed_save: function (music_title, music_url, music_thumbnail, description) {
        const Embed_queue = new Discord.EmbedBuilder()
            .setColor(color)
            .setTitle(music_title)
            .setURL(music_url)
            .setThumbnail(music_thumbnail)
            .setDescription(description)
            .setTimestamp()
        return Embed_queue;
    },

    Embed_saved: function (description, user) {
        const Embed_saved = new Discord.EmbedBuilder()
            .setAuthor({ name: user.username, iconURL: user.avatarURL() })
            .setColor(color)
            .setDescription(description)
            .setTimestamp()
        return Embed_saved;
    },

    Embed_search: function (music_title, description) {
        const Embed_cantFindSong = new Discord.EmbedBuilder()
            .setColor(color)
            .setTitle(music_title)
            .setDescription(description)
            .setTimestamp()
        return Embed_cantFindSong;
    },

    Embed_help: function (help_title, help_thumbnail, description) {
        const Embed_help = new Discord.EmbedBuilder()
            .setColor(color)
            .setTitle(help_title)
            .setURL(github)
            .setThumbnail(help_thumbnail)
            .setDescription(description)
            .setTimestamp()
        return Embed_help;
    },

    Embed_help2: function (command, description) {
        const Embed_help2 = new Discord.EmbedBuilder()
            .setColor(color)
            .setTitle(`Command **${command}**`, '')
            .setDescription(description)
        return Embed_help2;
    },

    Embed_status: function (uptime, os, node_v, djs_v, cpu, cpu_usage, ram, heap, ping, serverCount) {
        const Embed_status = new Discord.EmbedBuilder()
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
        return Embed_status;
    },

    Embed_server: function (serverlist) {
        const Embed_server = new Discord.EmbedBuilder()
            .setColor(color)
            .setTitle(`Servers that have **${bot_name}**`, '')
            .setDescription(serverlist)
        return Embed_server;
    },

    Embed_ping: function (bot, api) {
        const Embed_ping = new Discord.EmbedBuilder()
            .setColor(color)
            .setTitle('🛰️ LATENCY')
            .setDescription(`Bot : **${bot}**\nAPI : **${api}ms**`)
        return Embed_ping;
    },

    Embed_connect: function () {
        const Embed_connect = new Discord.EmbedBuilder()
            .setColor(color)
            .setDescription('Voice channel connected successfully.')
        return Embed_connect;
    },
    Embed_disconnect: function () {
        const Embed_disconnect = new Discord.EmbedBuilder()
            .setColor(color)
            .setDescription('Finished playing.')
            
        return Embed_disconnect;
    },
    Embed_balance: function (user, balance, bank) {
        const Embed_balance = new Discord.EmbedBuilder()
            .setAuthor({ name: user.username, iconURL: user.avatarURL() })
            .setColor(color)
            .setTitle('Balance')
            .setDescription(`Cash: **${balance}**\nBank: **${bank}**`)
            .setTimestamp()
        return Embed_balance;
    },
    Embed_work: function (reward) {
        const Embed_work = new Discord.EmbedBuilder()
            .setAuthor({ name: 'Work'})
            .setColor(color)
            .setDescription(`${reward}`)
            .setTimestamp()
        return Embed_work;
    },
    Embed_deposit: function (amount) {
        const Embed_deposit = new Discord.EmbedBuilder()
            .setAuthor({ name: 'Deposit'})
            .setColor(color)
            .setDescription(`You deposited **${amount}** coins into your bank!`)
            .setTimestamp()
        return Embed_deposit;
    },
    Embed_withdraw: function (amount) {
        const Embed_withdraw = new Discord.EmbedBuilder()
            .setAuthor({ name: 'Withdraw'})
            .setColor(color)
            .setDescription(`You withdrew **${amount}** coins from your bank!`)
            .setTimestamp()
        return Embed_withdraw;
    },
    Embed_transfer: function (amount, to, from) {
        transferDetails = `\`\`\`From: ${from}\nTo: ${to}\nAmount: ${amount}\`\`\`\nThe transaction was successful!
        `
        const Embed_transfer = new Discord.EmbedBuilder()
            .setAuthor({ name: 'Transfer'})
            .setColor(color)
            .setDescription(`${transferDetails}`)
            .setTimestamp()
        return Embed_transfer;
    },
    Embed_shop_find: function (item) {
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
        const Embed_shop = new Discord.EmbedBuilder()
            .setAuthor({ name: 'Item Info'})
            .setColor(color)
            .setDescription(content)
            .setTimestamp()
        return Embed_shop;
    },
    Embed_shop: function (itemList) {
        const Embed_shop = new Discord.EmbedBuilder()
            .setAuthor({ name: 'Shop'})
            .setColor(color)
            .setDescription(itemList)
            .setTimestamp()
        return Embed_shop;
    },
    Embed_shop_buy: function (item, amount) {
        const Embed_shop_buy = new Discord.EmbedBuilder()
            .setAuthor({ name: 'Buy'})
            .setColor(color)
            .setDescription(`You bought **${amount}** ${item.emoji} ${item.name} for **${item.price * amount}** coins!`)
            .setTimestamp()
        return Embed_shop_buy;
    },
    Embed_shop_sell: function (item, amount, sellPrice) {
        const Embed_shop_sell = new Discord.EmbedBuilder()
            .setAuthor({ name: 'Sell'})
            .setColor(color)
            .setDescription(`You sold **${amount}** ${item.emoji} ${item.name} for **${sellPrice}** coins!`)
            .setTimestamp()
        return Embed_shop_sell;
    },
    Embed_inventory: function (inventory) {
        const Embed_inventory = new Discord.EmbedBuilder()
            .setAuthor({ name: 'Inventory'})
            .setColor(color)
            .setDescription(inventory)
            .setTimestamp()
        return Embed_inventory;
    },
}