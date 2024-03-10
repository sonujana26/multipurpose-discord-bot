const config = require(`${process.cwd()}/botconfig/config.json`);
const { Client, Message, MessageEmbed } = require('discord.js');

module.exports = {
  name: "intelligence",
  aliases: ['intelligent', 'iq'],
  usage: "intelligence <Mention Member>",
  description: "Shows How Member Intelligent Is!",
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
        .setTitle(`<:BigBrain:1198473654871281734> About your Intelligence`)
        .setDescription(`**<@${Member.id}> has an IQ score of ${Result}% <a:MATHS:1204235249916317697>**`)
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
          .setTitle(`<:cx_cross:1198077504599117834> Got a Error:`)
          .setDescription(`\`\`\`${e.stack}\`\`\``)
          .setFooter(`Having: ${message.guild.memberCount} Users`)
        ]
      })
    }
  }
};

