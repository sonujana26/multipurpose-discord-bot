const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch');
const config = require(`${process.cwd()}/botconfig/config.json`);

module.exports = {
  name: 'image',
  aliases: ['img'],
  usage: '',
  description: 'Search for images through Google Images',
  category: '🕹️ Fun',
  cooldown: 5,
  type: "image",
  run: async (client, message, args, cmduser, text, prefix) => {
    try {
      if (!args.length) {
        const embed = new MessageEmbed()
          .setColor("RED")
          .setDescription("<:cx_cross:1198077504599117834> Please specify the name of the image you want to search.");
        return message.channel.send({ embeds: [embed] });
      }

      const cx = process.env.google_Engine_id || config.google_Engine_id;
const key = process.env.google_API || config.google_API;

const res = await fetch(`https://www.googleapis.com/customsearch/v1?q=${encodeURIComponent(args.join(' '))}&cx=${cx}&key=${key}&searchType=image`);
const data = await res.json();

if (!data.items?.length) {
    const embed = new MessageEmbed()
        .setColor("RED")
        .setDescription("<:cx_cross:1198077504599117834> No results found.");
    return message.channel.send({ embeds: [embed] });
}
      

      const embed = new MessageEmbed()
        .setColor("#FF0000")
        .setImage(data.items[0].link)
        .setTitle(args.join(' '));

      message.channel.send({ embeds: [embed] });
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
