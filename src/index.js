'use strict';

const fs = require('fs');

const dotenv = require('dotenv');
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
const { Player } = require('discord-player');
const express = require('express');
require('console-stamp')(console, { format: ':date(yyyy/mm/dd HH:MM:ss)' });

const registerPlayerEvents = require(`${__dirname}/events/discord-player/player`);
const cst = require(`${__dirname}/utils/constants`);

dotenv.config();
const ENV = process.env;


let client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates,
    ],
    partials: [Partials.Channel],
    disableMentions: 'everyone',
});

const { Database } = require('quickmongo');
const db = new Database(process.env.MONGO_URL);

db.on("ready", () => {
    console.log("Connected to the database");
});
 
client.db = db;



client.config = cst.config;
client.commands = new Collection();
client.player = new Player(client, {
    autoRegisterExtractor: false,
    ytdlOptions: cst.ytdlOptions
});


const player = client.player;

const emotes = {
    REACT_EMOTE: "<a:gaynod:1190346081133936782>",
    CURRENCY_EMOTE: "",
    DENY_EMOTE: "<a:NO:1193614076023144619>",
    ACCEPT_EMOTE: "<a:Yes:1193614234400084068>",
    APPROVE_EMOTE: "<a:Yes:1193614234400084068>",
    WHAT_EMOTE: "<:whatwhat:1039206140296302592>"
}


const setEnvironment = () => {
    return new Promise((resolve, reject) => {
        client.config.name = typeof (ENV.BOT_NAME) === 'undefined'
            ? client.config.name
            : ENV.BOT_NAME;
        // Prefix
        client.config.prefix = typeof (ENV.PREFIX) === 'undefined'
            ? client.config.prefix
            : ENV.PREFIX;
        // Emotes
        client.config.reactEmote = typeof (emotes.REACT_EMOTE) === 'undefined'
            ? client.config.reactEmote
            : emotes.REACT_EMOTE;
        client.config.deny =  typeof (emotes.DENY_EMOTE) === '❌'
            ? client.config.deny
            : emotes.DENY_EMOTE;
        client.config.approve = typeof (emotes.ACCEPT_EMOTE) === '✅'
            ? client.config.approve
            : emotes.APPROVE_EMOTE;
        client.config.accept = typeof (emotes.ACCEPT_EMOTE) === '✅'
            ? client.config.accept
            : emotes.ACCEPT_EMOTE;
        client.config.what = typeof (emotes.WHAT_EMOTE) === 'undefined'
            ? client.config.what
            : emotes.WHAT_EMOTE;
        // Rest of the stuff
        client.config.ownerID = typeof (ENV.OWNER_ID) === '552998962055872515'
            ? client.config.ownerID
            : ENV.OWNER_ID;
        client.config.playing = typeof (ENV.PLAYING) === 'undefined'
            ? client.config.playing
            : ENV.PLAYING;

        client.config.defaultVolume = typeof (ENV.DEFAULT_VOLUME) === 'undefined'
            ? client.config.defaultVolume
            : Number(ENV.DEFAULT_VOLUME);

        client.config.maxVolume = typeof (ENV.MAX_VOLUME) === 'undefined'
            ? client.config.maxVolume
            : Number(ENV.MAX_VOLUME);

        client.config.autoLeave = typeof (ENV.AUTO_LEAVE) === 'undefined'
            ? client.config.autoLeave
            : (String(ENV.AUTO_LEAVE) === 'true' ? true : false);

        client.config.autoLeaveCooldown = typeof (ENV.AUTO_LEAVE_COOLDOWN) === 'undefined'
            ? client.config.autoLeaveCooldown
            : Number(ENV.AUTO_LEAVE_COOLDOWN);

        client.config.displayVoiceState = typeof (ENV.DISPLAY_VOICE_STATE) === 'undefined'
            ? client.config.displayVoiceState
            : (String(ENV.DISPLAY_VOICE_STATE) === 'true' ? true : false);

        client.config.port = typeof (ENV.PORT) === 'undefined'
            ? client.config.port
            : Number(ENV.PORT);

        client.config.textQuery = typeof (ENV.TEXT_QUERY_TYPE) === 'undefined'
            ? client.config.textQuery
            : ENV.TEXT_QUERY_TYPE

        client.config.urlQuery = typeof (ENV.URL_QUERY_TYPE) === 'undefined'
            ? client.config.urlQuery
            : ENV.URL_QUERY_TYPE;

        // Colors
        client.config.embedColor = typeof (ENV.EMBED_COLOR) === 'undefined'
            ? client.config.embedColor
            : ENV.EMBED_COLOR;
        //console.log('setEnvironment: ', client.config);
        resolve();
    });
}


const loadFramework = () => {
    console.log(`-> loading Web Framework ......`);
    return new Promise((resolve, reject) => {
        const app = express();
        const port = client.config.port || 33333;

        app.get('/', function (req, res) {
            res.send('200 ok.')
        });

        app.listen(port, function () {
            console.log(`Server start listening port on ${port}`);
            resolve();
        });
    })
}


const loadEvents = () => {
    console.log(`-> loading Events ......`);
    return new Promise((resolve, reject) => {
        const files = fs.readdirSync(`${__dirname}/events/`).filter(file => file.endsWith('.js'));

        console.log(`+--------------------------------+`);
        for (const file of files) {
            try {
                const event = require(`${__dirname}/events/${file}`);
                console.log(`| Loaded event ${file.split('.')[0].padEnd(17, ' ')} |`);

                client.on(file.split('.')[0], event.bind(null, client));
                delete require.cache[require.resolve(`${__dirname}/events/${file}`)];
            } catch (error) {
                reject(error);
            }
        };
        console.log(`+--------------------------------+`);
        console.log(`${cst.color.grey}-- loading Events finished --${cst.color.white}`);
        resolve();
    })
}

const loadPlayer = () => {
    return new Promise(async (resolve, reject) => {
        try {
            await player.extractors.loadDefault();
            registerPlayerEvents(player, client);
        } catch (error) {
            reject(error);
        }
        console.log('-> loading Player Events finished');
        resolve();
    })
}


const loadCommands = () => {
    console.log(`-> loading Commands ......`);
    return new Promise((resolve, reject) => {
        const commandFolders = fs.readdirSync(`${__dirname}/commands/`).filter(folder => fs.lstatSync(`${__dirname}/commands/${folder}`).isDirectory());

        for (const folder of commandFolders) {
            console.log(`-> ${folder} Commands ......`);
            console.log(`+---------------------------+`);

            const files = fs.readdirSync(`${__dirname}/commands/${folder}`).filter(file => file.endsWith('.js'));

            for (const file of files) {
                try {
                    const command = require(`${__dirname}/commands/${folder}/${file}`);

                    console.log(`| Loaded Command ${command.name.toLowerCase().padEnd(10, ' ')} |`);

                    client.commands.set(command.name.toLowerCase(), command);
                    delete require.cache[require.resolve(`${__dirname}/commands/${folder}/${file}`)];
                } catch (error) {
                    reject(error);
                }
            };

            console.log(`+---------------------------+`);
            console.log(`${cst.color.grey}-- loading ${folder} Commands finished --${cst.color.white}`);
        }

        resolve();
    })
}


Promise.resolve()
    .then(() => setEnvironment())
    .then(() => loadFramework())
    .then(() => loadEvents())
    .then(() => loadPlayer())
    .then(() => loadCommands())
    .then(() => {
        console.log(`${cst.color.green}*** All loaded successfully ***${cst.color.white}`);
        client.login(ENV.TOKEN);
    });




process.on('unhandledRejection', error => {
    console.error('Unhandled promise rejection:', error);
});
