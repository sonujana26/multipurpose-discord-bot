const config = require(`${process.cwd()}/botconfig/config.json`);
const { Client, Message, MessageEmbed } = require('discord.js');

module.exports = {
  name: "chumtiya",
  aliases: ['c','chutiya'],
  usage: "chumtiya <Mention Member>",
  description: "Shows Chutiyapa of a Member!",
  category: "🕹️ Fun",
  cooldown: 0,
  type: "text",

  run: async (client, message, args, cmduser, text, prefix) => {
    try {
      let Member =
        message.mentions.users.first() ||
        message.author;
      let Result = Math.floor(Math.random() * 101);
      message.reply({ embeds: [new MessageEmbed()
        .setColor(ee.color)
        .setFooter(ee.footertext, ee.footericon)
        .setTitle(`<:chutiya:1213328894933864539> About your Chutiyapa`)
        .setDescription(`**Abbe <@${Member.id}> to ${Result}% Chootya ha <a:chutiya:1213329730598604810>**`)
        .setTimestamp()]});
    } catch (e) {
      console.log(String(e.stack).bgRed)
      const errorLogsChannel = client.channels.cache.get(config.botlogs.errorLogsChannel);
      return errorLogsChannel.send({
        embeds: [new MessageEmbed()
          .setColor("RED")
          .setAuthor(message.guild.name, message.guild.iconURL({
            dynamic: true
          }))
          .setTitle(`:x: Got a Error:`)
          .setDescription(`\`\`\`${e.stack}\`\`\``)
          .setFooter(`Having: ${message.guild.memberCount} Users`)
        ]
      })
    }
  }
};
