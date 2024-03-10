const { MessageEmbed } = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const { swap_pages2 } = require(`${process.cwd()}/handlers/functions`);

module.exports = {
  name: "sponsor",
  category: "🔰 Info",
  aliases: ["sponsors"],
  description: "Shows the sponsor of this BoT",
  usage: "sponsor",
  type: "bot",
  run: async (client, message, args, cmduser, text, prefix) => {
    let es = client.settings.get(message.guild.id, "embed");
    let ls = client.settings.get(message.guild.id, "language");

    try {
      let embed1 = new MessageEmbed()
        .setColor(es.color)
        .setTitle(eval(client.la[ls]["cmds"]["info"]["sponsor"]["variable1"]))
        .setURL("https://panel.rudracloud.com/")
        .setDescription(`
The Sponsor of Olympus Bot is:
**RudraCloud Hosting**

<a:Right:1212065800152817734> RudraCloud Hosting is sponsoring us with top-notch hosting services.
<a:Right:1212065800152817734> Thanks to them, we can provide you with a seamless experience.

**What they offer:**
<a:Right:1212065800152817734> **>>** Discord Bot Hosting
<a:Right:1212065800152817734> **>>** Reliable Servers
<a:Right:1212065800152817734> **>>** Web Hosting
<a:Right:1212065800152817734> **>>** Payment Portal: [Click Here](https://pay.rudracloud.com/)

[**Website**](https://panel.rudracloud.com/)
[**Payment Portal**](https://pay.rudracloud.com/)
`)
        .setImage("https://media.discordapp.net/attachments/1089810823465148486/1155550735799431249/SPOILER_SmartSelect_20230924_222733_Discord.jpg?ex=6513b83c&is=651266bc&hm=41b66355a360db4aee525c7695bf363d8f2b6dbc435321812a004084ea342195&=&width=735&height=423")
        .setFooter("RudraCloud Hosting", "https://th.bing.com/th/id/OIP.3tcnrbul1kSSj3J7UakEjQHaDj?pid=ImgDet&rs=1");

      swap_pages2(client, message, [embed1]);
    } catch (e) {
      console.log(String(e.stack).grey.bgRed);
      return message.reply({
        embeds: [
          new MessageEmbed()
            .setColor(es.wrongcolor)
            .setFooter(client.getFooter(es))
            .setTitle(client.la[ls].common.erroroccur)
            .setDescription(
              eval(client.la[ls]["cmds"]["info"]["color"]["variable2"])
            ),
        ],
      });
    }
  },
};
