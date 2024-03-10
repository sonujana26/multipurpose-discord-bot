const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
const path = require("path");

module.exports = {
    name: "gif",
    aliases: ["gifs", "giphy"],
    category: "🕹️ Fun",
    usage: `gif <Search Query>`,
    description: "Search for a gif!",
    type: "text",
    
    run: async (client, message, args, cmduser, text, prefix) => {
        try {
            if (!args[0]) return message.reply({ content: `<:cx_cross:1198077504599117834> Please supply a search query!` });

            const query = args.join(" ");
            const response = await fetch(`https://api.giphy.com/v1/gifs/search?q=${encodeURIComponent(query)}&api_key=${process.env.giphy_API}&limit=1`);
            const json = await response.json();

            if (!json.data || json.data.length === 0) {
                return message.reply({ content: `<:cx_cross:1198077504599117834> No gifs found for the given search query!` });
            }

            message.reply(json.data[0].url);
        } catch (error) {
            console.error(error);
            const errorLogsChannel = client.channels.cache.get(config.botlogs.errorLogsChannel);
            return errorLogsChannel.send({
                embeds: [new MessageEmbed()
                    .setColor("RED")
                    .setAuthor(message.guild.name, message.guild.iconURL({ dynamic: true }))
                    .setTitle(`<:cx_cross:1198077504599117834> Got a Error:`)
                    .setDescription(`\`\`\`${error.stack}\`\`\``)
                    .setFooter(`Having: ${message.guild.memberCount} Users`)
                ]
            });
        }
    }
};