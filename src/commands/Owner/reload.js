module.exports = {
    name: 'reload',
    aliases: ['rl'],
    description: 'Reloads a command',
    usage: 'reload <command>',
    category: 'Owner',
    voiceChannel: false,
    options: [
        {
            name: 'command',
            type: 3,
            description: 'Command to reload',
            required: true,
        }
    ],

    execute(client, message, args) {
        if (message.author.id !== client.config.ownerID) return;

        const commandName = args[0].toLowerCase();
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command)
            return message.reply({ content: `${client.config.deny} | There is no command with name or alias \`${commandName}\`.`, allowedMentions: { repliedUser: false } });

        const commandFolder = command.category;
        let pathTOcommand = `../${commandFolder}/${command.name}.js`;

        delete require.cache[require.resolve(pathTOcommand)];

        try {
            const newCommand = require(pathTOcommand);
            client.commands.set(newCommand.name, newCommand);
            message.reply({ content: `${client.config.accept} | Command \`${command.name}\` was reloaded!`, allowedMentions: { repliedUser: false } });
        } catch (error) {
            console.error(error);
            message.reply({ content: `${client.config.deny} | There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``, allowedMentions: { repliedUser: false } });
        }
    },
    slashExecute(client, interaction) {
        if (interaction.user.id !== client.config.ownerID) return;
        const commandName = interaction.options.getString('command');
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command)
            return interaction.reply({ content: `${client.config.deny} | There is no command with name or alias \`${commandName}\`.`, allowedMentions: { repliedUser: false } });

        const commandFolder = command.category;
        let pathTOcommand = `../${commandFolder}/${command.name}.js`;

        delete require.cache[require.resolve(pathTOcommand)];

        try {
            const newCommand = require(pathTOcommand);
            client.commands.set(newCommand.name, newCommand);
            interaction.reply({ content: `${client.config.accept} | Command \`${command.name}\` was reloaded!`, allowedMentions: { repliedUser: false } });
        } catch (error) {
            console.error(error);
            interaction.reply({ content: `${client.config.deny} | There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``, allowedMentions: { repliedUser: false } });
        }
    },
}