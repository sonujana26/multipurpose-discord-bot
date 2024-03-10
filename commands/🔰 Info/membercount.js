const Discord = require("discord.js");
const {MessageEmbed} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`)
var ee = require(`${process.cwd()}/botconfig/embed.json`)
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const moment = require("moment")
const { handlemsg } = require(`${process.cwd()}/handlers/functions`)
module.exports = {
  name: "membercount",
  aliases: ["members", "mc"],
  category: "🔰 Info",
  description: "Shows how many Members there are in this Server",
  usage: "membercount",
  type: "server",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      await message.guild.members.fetch().catch(() => {});
      
        message.reply({embeds: [new Discord.MessageEmbed()
        .setAuthor(client.la[ls].cmds.info.membercount.title + " " +message.guild.name, message.guild.iconURL({
          dynamic: true
        }), "https://discord.com/api/oauth2/authorize?client_id=1103258973517389855&permissions=8&scope=applications.commands%20bot")
        .setColor(es.color)
        .addField(client.la[ls].cmds.info.membercount.field1, "<:discord:1204249483475554314> \`" + message.guild.memberCount + "\`", true)
        .addField(client.la[ls].cmds.info.membercount.field2, "<:userRed:1205343080836759633> \`" + message.guild.members.cache.filter(member => !member.user.bot).size + "\`", true)
        .addField(client.la[ls].cmds.info.membercount.field3, "<:bot_flag:1204231176861261844> \`" + message.guild.members.cache.filter(member => member.user.bot).size + "\`", true)
        
        .addField(client.la[ls].cmds.info.membercount.field4, "<:online:1212050840123215943> \`" + message.guild.members.cache.filter(member => member.presence && member.presence && member.presence.status != "offline").size + "\`", true)
        .addField(client.la[ls].cmds.info.membercount.field5, "<:idle:1212051221628719145> \`" + message.guild.members.cache.filter(member => member.presence && member.presence && member.presence.status == "idle").size + "\`", true)
        .addField(client.la[ls].cmds.info.membercount.field6, "<:Dnd:1212051014882955315> \`" + message.guild.members.cache.filter(member => member.presence && member.presence && member.presence.status == "dnd").size + "\`", true)
        .addField(client.la[ls].cmds.info.membercount.field7, "<:offline:1212066496965255208>\`" + message.guild.members.cache.filter(member => !member.presence || member.presence && member.presence.status == "offline").size + "\`", true)
        .setImage("https://media.discordapp.net/attachments/588985630051139584/690175153069752364/animated-dividing-line-image-0111.gif")
        .setTimestamp()
      ]});
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["info"]["color"]["variable2"]))
      ]});
    }
  }
}
/**
 * @INFO
 * Bot Coded by sonujana#0 | https://discord.gg/theolympus69 
 * @INFO
 * Please mention Him / Team Olympus, when using this Code
 * @INFO
 * Instagram - https://instagram.com/sonujana.ig
 */
