const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
const path = require("path");

module.exports = {
  name: path.parse(__filename).name,
  category: "🕹️ Fun",
  usage: `${path.parse(__filename).name}`,
  type: "user",
  description: "Fetch a random meme from r/memes.",
  run: async (client, interaction, cmduser, es, ls, prefix, player, message) => {
    if (!client.settings.get(message.guild.id, "FUN")) {
      return interaction?.reply({
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
        ephemeral: true,
      });
    }

    const redditURL = "https://www.reddit.com/r/memes.json";
    const headers = {
      "User-Agent": "MEMES",
    };

    try {
      const response = await fetch(redditURL, { headers });
      const json = await response.json();

      if (!json || !json.data || !json.data.children || json.data.children.length === 0) {
        return interaction?.reply({
          content: "<:cx_tick:1198077126939779102> **Could not find a new meme...**\n> *Try again, please!*",
          ephemeral: true,
        });
      }

      const memes = json.data.children;
      const randomMeme = memes[Math.floor(Math.random() * memes.length)];

      if (!randomMeme || !randomMeme.data || !randomMeme.data.url) {
        return interaction?.reply({
          content: "<:cx_tick:1198077126939779102> **Could not find a new meme...**\n> *Try again, please!*",
          ephemeral: true,
        });
      }

      return interaction?.reply({
        content: randomMeme.data.url,
      });
    } catch (error) {
      console.error("Error fetching meme:", error);
      return interaction?.reply({
        content: "<:cx_tick:1198077126939779102> **An error occurred while fetching the meme...**",
        ephemeral: true,
      });
    }
  },
};
