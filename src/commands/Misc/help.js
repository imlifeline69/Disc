const embed = require('../../embeds/embeds');

module.exports = {
    name: 'help',
    aliases: ['h'],
    showHelp: false,
    description: 'Get commands help',
    usage: 'help [command]',
    category: 'Misc',
    options: [
        {
            name: "command",
            description: "which command need help",
            type: 3,
            required: false
        }
    ],
    execute (client, message, args) {
        const prefix = client.config.prefix;
        let command = '';
        if(args[0]){
            command = message.args.join(' ');
        } else {
            command = null;
        }

        if (!command) {
            let title = client.user.username;
            let thumbnail = client.user.displayAvatarURL();
            const commands = client.commands.filter(x => x.showHelp !== false);

            let categories = {};
            commands.forEach(x => {
                if (!categories[x.category]) {
                    categories[x.category] = [];
                }
                if(x.category === 'Owner' && message.author.id !== client.config.ownerID) return;
                categories[x.category].push(x);
            });

            let description = '';
            for (const category in categories) {
                description += `**${category}**\n`;
                description += categories[category].map(x => `• \`${prefix}${x.name}${x.aliases[0] ? ` (${x.aliases.map(y => y).join(', ')})\`` : '\`'}`).join('\n');
                description += '\n\n';
            }

            return message.channel.send({ embeds: [embed.Embed_help(title, thumbnail, description)] });
        }
        else {
            let helpCmd = command;
            const commands = client.commands.filter(x => x.showHelp !== false);
            //console.log('helpCmd', helpCmd);

            let found = false;
            found = commands.find(x => {
                if (helpCmd === x.name || x.aliases.includes(helpCmd)) {
                    let command = x.name
                    let description = `${x.description}\n\`\`\`${prefix}${x.usage}\`\`\``;

                    message.channel.send({ embeds: [embed.Embed_help2(command, description)] });
                    return true;
                }
            });

            if (!Boolean(found)) return message.reply({ content: `${client.config.deny} | The command not found.`, allowedMentions: { repliedUser: false } });
        }
    },
    slashExecute(client, interaction) {
        const prefix = client.config.prefix;
        const command = interaction.options.getString("command");

        if (!command) {
            let title = client.user.username;
            let thumbnail = client.user.displayAvatarURL();
            const commands = client.commands.filter(x => x.showHelp !== false);

            let categories = {};
            commands.forEach(x => {
                if (!categories[x.category]) {
                    categories[x.category] = [];
                }
                categories[x.category].push(x);
            });

            let description = '';
            for (const category in categories) {
                description += `**${category}**\n`;
                description += categories[category].map(x => `• \`${prefix}${x.name}${x.aliases[0] ? ` (${x.aliases.map(y => y).join(', ')})\`` : '\`'}`).join('\n');
                description += '\n\n';
            }

            return interaction.reply({ embeds: [embed.Embed_help(title, thumbnail, description)], allowedMentions: { repliedUser: false } });
        }
        else {
            let helpCmd = command;
            const commands = client.commands.filter(x => x.showHelp !== false);
            //console.log('helpCmd', helpCmd);

            let found = false;
            found = commands.find(x => {
                if (helpCmd === x.name || x.aliases.includes(helpCmd)) {
                    let command = x.name
                    let description = `${x.description}\n\`\`\`${prefix}${x.usage}\`\`\``;

                    interaction.reply({ embeds: [embed.Embed_help2(command, description)], allowedMentions: { repliedUser: false } });
                    return true;
                }
            });

            if (!Boolean(found)) return interaction.reply({ content: `${client.config.deny} | The command not found.`, allowedMentions: { repliedUser: false } });
        }
    }
};

