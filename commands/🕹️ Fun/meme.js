const fetch = require("node-fetch");
const Discord = require("discord.js");
const { MessageEmbed } = require("discord.js");

const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);

module.exports = {
  name: "meme",
  category: "🕹️ Fun",
  usage: "meme",
  description: "Fetch a meme from r/memes",
  run: async (client, message, args, cmduser, text, prefix) => {
    let es = client.settings.get(message.guild.id, "embed");
    let ls = client.settings.get(message.guild.id, "language");
    if (!client.settings.get(message.guild.id, "FUN")) {
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(client.la[ls].common.disabled.title)
            .setDescription(
              require(`${process.cwd()}/handlers/functions`).handlemsg(
                client.la[ls].common.disabled.description,
                { prefix: prefix }
              )
            ),
        ],
      });
    }

    try {
      const response = await fetch("https://www.reddit.com/r/memes/random.json");

      if (!response.ok) {
        throw new Error("Failed to fetch meme from Reddit.");
      }

      const data = await response.json();

      if (!data[0] || !data[0].data || !data[0].data.children || data[0].data.children.length === 0) {
        throw new Error("No memes found on Reddit.");
      }

      const randomMeme = data[0].data.children[0].data;

      return message.reply({ content: randomMeme.url });
    } catch (e) {
      console.error(e);
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(client.la[ls].common.erroroccur)
            .setDescription(
              "An error occurred while fetching the meme from Reddit."
            ),
        ],
      });
    }
  },
};
