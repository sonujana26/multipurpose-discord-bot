const config = require(`${process.cwd()}/botconfig/config.json`);
const { Client, Message, MessageEmbed } = require('discord.js');

module.exports = {
  name: "howgay",
  aliases: ['gay'],
  usage: "howgay <Mention Member>",
  description: "Shows How Member Gay Is!",
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
        .setTitle(`<a:gay:1213280970200059954> About your Gayness`)
        .setDescription(`**<@${Member.id}> Is ${Result}% Gay 🏳️‍🌈**`)
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
