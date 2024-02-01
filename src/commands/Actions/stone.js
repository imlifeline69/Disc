const embed = require('../../embeds/embeds');

module.exports = {
    name: 'stone',
    aliases: [],
    description: 'Stone',
    usage: 'stone <user>',
    category: 'Actions',
    options: [],
    slashExecute(client, interaction) {
        interaction.reply({ files: ['./Images/throws-rocks-dont-like-it.gif'] });
    },
    execute(client, message) {
        if (message.reference) {
            message.delete();
            message.channel.send({ content: `dont like`, files: ['./Images/throws-rocks-dont-like-it.gif'], reply: { messageReference: message.reference.messageId }});
        } else if (message.mentions.users.first()) {
            let mentionedUser = message.mentions.users.first();
            let mentionedUserId = mentionedUser.id;
            message.channel.send({ content: `<@${mentionedUserId}> dont like`, files: ['./Images/throws-rocks-dont-like-it.gif']});
        } else {
            message.channel.send({ files: ['./Images/throws-rocks-dont-like-it.gif'] });
        } 
    },
};
