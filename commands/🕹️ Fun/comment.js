const { MessageEmbed, MessageAttachment } = require('discord.js');
const canvacord = require('canvacord');
const config = require(`${process.cwd()}/botconfig/config.json`);

module.exports = {
  name: 'comment',
  aliases: ["cmt","cmnt"],
  usage: 'comment <text>',
  description: 'Shows your text as a Youtube Comment',
  category: "🕹️ Fun",
  cooldown: 0,

  async run(client, message, args, cmduser, text, prefix) {
    try {
      const comment = args.join('');
      if (!comment) return message.reply({
        embeds: [new MessageEmbed()
          .setColor("RED")
          .setDescription("<:cx_cross:1198077504599117834> Please provide text to create a Youtube comment.")
        ]
      });

      const yt = await canvacord.Canvas.youtube({
        avatar: message.author.displayAvatarURL({ format: "png" }),
        username: message.author.username,
        content: args.join(" ")
      });

      const attachment = new MessageAttachment(yt, 'comment.png');
      message.reply({ files: [attachment] });
    } catch (error) {
      console.error(error);
      const errorLogsChannel = client.channels.cache.get(config.botlogs.errorLogsChannel);
      if (errorLogsChannel) {
        errorLogsChannel.send({
          embeds: [new MessageEmbed()
            .setColor("RED")
            .setTitle("Error")
            .setDescription(`An error occurred in the comment command:\n\`\`\`${error}\`\`\``)
          ]
        });
      }
      message.reply({
        embeds: [new MessageEmbed()
          .setColor("RED")
          .setDescription("<:cx_cross:1198077504599117834> An error occurred while processing your request.")
        ]
      });
    }
  }
};
