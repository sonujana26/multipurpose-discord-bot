const Discord = require("discord.js");
const {MessageEmbed, MessageAttachment} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
const canvacord = require("canvacord");
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const request = require("request");
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);

module.exports = {
  name: "8ball",
  aliases: ["8b"],
  category: "🕹️ Fun",
  description: "Answers your Question",
  usage: "8ball <Questions>",
  type: "text",
  run: async (client, message, args, cmduser, text, prefix) => {
    // Check if the FUN feature is enabled
    if (!client.settings.get(message.guild.id, "FUN")) {
      const embed1 = new MessageEmbed()
        .setColor("#FF0000")
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(require(`${process.cwd()}/handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}));

      return message.reply({ embeds: [embed1] });
    }

    try {
      const question = args.join(" ");
      if (!question) {
        const embed2 = new MessageEmbed()
          .setColor("#FF0000")
          .setTitle("Error")
          .setDescription("Please provide a question.");

        return message.reply({ embeds: [embed2] });
      }

      // Array of 8ball responses
      const replies = [
        'yes.',
        'Outlook seems good.',
        'wow',
        'of course,',
        'Yes - definitely',
        'no.',
        'Better not tell you now.',
        'Outlook is not so good..',
        'never',
        'Cannot predict now',
        'I dont know.',
        'I dont know *yet*...',
        'not a chance.',
        'I think so.',
        'only for today!',
        'not for today c:',
        'sadly yes..',
        'sadly no..',
        'maybe!',
        'ask again.. later..',
        'Maybe.',
        'Certainly not.',
        'I hope so.',
        'Not in your wildest dreams.',
        'There is a good chance.',
        'Quite likely.',
        'I think so.',
        'I hope not.',
        'I hope so.',
        'Never!',
        'Fuhgeddaboudit.',
        'Ahaha! Really?!?',
        'Pfft.',
        'Sorry, bucko.',
        'Hell, yes.',
        'Hell to the no.',
        'The future is bleak.',
        'The future is uncertain.',
        'I would rather not say.',
        'Who cares?',
        'Possibly.',
        'Never, ever, ever.',
        'There is a small chance.',
        'Yes!'
      ];

      // Pick a random response from the array
      const randomIndex = Math.floor(Math.random() * replies.length);
      const reply = replies[randomIndex];

      const embed3 = new MessageEmbed()
        .setTitle("🎱 8ball")
        .setColor("RANDOM")
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
        .addField("<:Question:1204227415048585276> Question:", question)
        .addField("<:userRed:1205343080836759633> Asked by:", message.author.tag)
        .addField("<:comment:1204261159776161822> Reply:", reply);
      

      return message.reply({ embeds: [embed3] });
    } catch (e) {
      console.error(e);
      const embed4 = new MessageEmbed()
        .setColor("#FF0000")
        .setTitle("Error")
        .setDescription("An error occurred while processing your request.");

      return message.reply({ embeds: [embed4] });
    }
  }
};
