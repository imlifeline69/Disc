const { timeToSeconds } = require('../../utils/functions/timeToSeconds');


module.exports = {
    name: 'seek',
    aliases: [],
    description: 'seek',
    usage: 'seek <[hhmm]ss/[hh:mm]:ss> (ex: 3m20s, 1:20:55)',
    category: 'Music',
    voiceChannel: true,
    options: [
        {
            name: "seek",
            description: "traget time (ex: 3m20s, 1:20:55)",
            type: 3,
            required: true
        }
    ],

    execute(client, message, args) {
        const queue = client.player.nodes.get(message.guild.id);

        if (!queue)
            return message.reply({ content: `${client.config.deny} | There is no music currently playing.`, allowedMentions: { repliedUser: false } });

        if (!args[0])
            return message.reply({ content: `${client.config.deny} | Write the time of the music you want to seek.`, allowedMentions: { repliedUser: false } });


        const track = queue.currentTrack;
        const timestamp = queue.node.getTimestamp();
        if (timestamp.progress == 'Forever')
            return message.reply({ content: `${client.config.deny} | Can't seek in a live stream.`, allowedMentions: { repliedUser: false } });


        const str = args.join(' ');
        const tragetTime = timeToSeconds(str);
        const musicLength = timeToSeconds(track.duration);

        if(!tragetTime)
            return message.reply({ content: `${client.config.deny} | Invalid format for the target time.\n(**\`ex: 3m20s, 1m 50s, 1:20:55, 5:20\`**)`, allowedMentions: { repliedUser: false } });

        if (tragetTime >= musicLength)
            return message.reply({ content: `${client.config.deny} | Target time exceeds music duration. (\`${track.duration}\`)`, allowedMentions: { repliedUser: false } });


        const success = queue.node.seek(tragetTime * 1000);
        return success ? message.react(client.config.reactEmote) : message.reply({ content: `${client.config.deny} | Something went wrong.`, allowedMentions: { repliedUser: false } });
    },

    slashExecute(client, interaction) {
        const queue = client.player.nodes.get(interaction.guild.id);

        if (!queue)
            return interaction.reply({ content: `${client.config.deny} | There is no music currently playing.`, allowedMentions: { repliedUser: false } });


        const track = queue.currentTrack;
        const timestamp = queue.node.getTimestamp();
        if (timestamp.progress == 'Forever')
            return interaction.reply({ content: `${client.config.deny} | Can't seek in a live stream.`, allowedMentions: { repliedUser: false } });


        const str = interaction.options.getString("seek");
        const tragetTime = timeToSeconds(str);
        const musicLength = timeToSeconds(track.duration);

        if(!tragetTime)
            return interaction.reply({ content: `${client.config.deny} | Invalid format for the target time.\n(**\`ex: 3m20s, 1m 50s, 1:20:55, 5:20\`**)`, allowedMentions: { repliedUser: false } });

        if (tragetTime >= musicLength)
            return interaction.reply({ content: `${client.config.deny} | Target time exceeds music duration. (\`${track.duration}\`)`, allowedMentions: { repliedUser: false } });


        const success = queue.node.seek(tragetTime * 1000);
        return success ? interaction.reply("${client.config.accept} | Music seeked.") : interaction.reply({ content: `${client.config.deny} | Something went wrong.`, allowedMentions: { repliedUser: false } });
    },
};