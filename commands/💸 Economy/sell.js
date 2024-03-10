const {MessageEmbed} = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const { parseMilliseconds, duration, GetUser, nFormatter, ensure_economy_user } = require(`${process.cwd()}/handlers/functions`)
module.exports = {
  name: "sell",
  category: "💸 Economy",
  aliases: ["ecosell"],
  description: "Allows you to sell an item with 10% Zins.",
  usage: "sell [Item]",
  type: "info",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    if(!client.settings.get(message.guild.id, "ECONOMY")){
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor)
        .setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.disabled.title)
        .setDescription(require(`${process.cwd()}/handlers/functions`).handlemsg(client.la[ls].common.disabled.description, {prefix: prefix}))
      ]});
    }
    try {
    //command
    var user = message.author;
      
    if(user.bot) return message.reply(eval(client.la[ls]["cmds"]["economy"]["sell"]["variable1"]))
      
    //ensure the economy data
    ensure_economy_user(client, message.guild.id, user.id)
    //get the economy data 
    var data = client.economy.get(`${message.guild.id}-${user.id}`)
    var items = 0;
    var itemsvalue = 0;
    var theitems = [];
    for (const itemarray in data.items){
      items += data.items[`${itemarray}`];
      var prize = 0;
      switch(itemarray.toLowerCase()){
        case "yacht": prize = 75000; break;
        case "lamborghini": prize = 50000; break;
        case "car": prize = 6400; break;
        case "motorbike": prize = 1500; break;
        case "bicycle": prize = 500; break;
    
        case "nike": prize = 300; break;
        case "tshirt": prize = 60; break;
    
        case "mansion": prize = 45000; break;
        case "house": prize = 8000; break;
        case "dirthut": prize = 150; break;
    
        case "pensil": prize = 20; break;
        case "pen": prize = 10; break;
        case "condom": prize = 30; break;
        case "bottle": prize = 50; break;
    
        case "fish": prize = 1000; break;
        case "hamster": prize = 1500; break;
        case "dog": prize = 2000; break;
        case "cat": prize = 2000; break;
      }
      itemsvalue += Number(prize) * Number(data.items[`${itemarray}`]);
    }
    for (const itemarray in data.items){
      if(data.items[`${itemarray}`] == 0) continue
      switch(itemarray.toLowerCase()){
          case "mansion": theitems.push(`<:mansion_gurpy:1206791271578865674> ${data.items[`${itemarray}`]} Mansion${data.items[`${itemarray}`] > 1 ? "s":""} | \`${nFormatter(45000*data.items[`${itemarray}`])} 💸\``); break;
              case "house": theitems.push(`<a:House:1206791451325763614> ${data.items[`${itemarray}`]} House${data.items[`${itemarray}`] > 1 ? "s":""} | \`${nFormatter(8000*data.items[`${itemarray}`])} 💸\``); break;
              case "dirthut": theitems.push(`<:dirthouse:1206791561963241492>  ${data.items[`${itemarray}`]} Dirthut${data.items[`${itemarray}`] > 1 ? "s":""} | \`${nFormatter(150*data.items[`${itemarray}`])} 💸\``); break;

              case "pensil": theitems.push(`<:pencil:1206787634966302760> ${data.items[`${itemarray}`]} Pensil${data.items[`${itemarray}`] > 1 ? "s":""} | \`${nFormatter(20*data.items[`${itemarray}`])} 💸\``); break;
              case "pen": theitems.push(`<:ballpoint_pensive:1206787855918170194> ${data.items[`${itemarray}`]} Pen${data.items[`${itemarray}`] > 1 ? "s":""} | \`${nFormatter(10*data.items[`${itemarray}`])} 💸\``); break;
              case "condom": theitems.push(`<:condom:1206786581642485821> ${data.items[`${itemarray}`]} Condom${data.items[`${itemarray}`] > 1 ? "s":""} | \`${nFormatter(30*data.items[`${itemarray}`])} 💸\``); break;
              case "bottle": theitems.push(`<:bottle:1206788054099038209> ${data.items[`${itemarray}`]} Bottle ${data.items[`${itemarray}`] > 1 ? "s":""} | \`${nFormatter(50*data.items[`${itemarray}`])} 💸\``); break;

              case "fish": theitems.push(`<:fishu:1206788961993756732> ${data.items[`${itemarray}`]} Fish${data.items[`${itemarray}`] > 1 ? "es":""} | \`${nFormatter(1000*data.items[`${itemarray}`])} 💸\``); break;
              case "hamster": theitems.push(`<:hamster_cute:1206789104575057940> ${data.items[`${itemarray}`]} Hamster${data.items[`${itemarray}`] > 1 ? "s":""} | \`${nFormatter(1500*data.items[`${itemarray}`])} 💸\``); break;
              case "dog": theitems.push(`<:doge:1206789215988355112> ${data.items[`${itemarray}`]} Dog${data.items[`${itemarray}`] > 1 ? "s":""} | \`${nFormatter(2000*data.items[`${itemarray}`])} 💸\``); break;
              case "cat": theitems.push(`<:catsip:1206789338353115136> ${data.items[`${itemarray}`]} Cat${data.items[`${itemarray}`] > 1 ? "s":""} | \`${nFormatter(2000*data.items[`${itemarray}`])} 💸\``); break;          
       }
    }
    //return some message!
    if (!args[0])
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
        .setTitle(eval(client.la[ls]["cmds"]["economy"]["sell"]["variable2"]))
        .setDescription(eval(client.la[ls]["cmds"]["economy"]["sell"]["variable3"]))
        .addField("To sell items:", `\`${prefix}sell Pen 2\``)
      ]});

    let amountofbuy = Number(args[1]) || 1;
      if (amountofbuy == 0)
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(user.tag, user.displayAvatarURL({ dynamic: true }))
          .setTitle(eval(client.la[ls]["cmds"]["economy"]["sell"]["variable4"]))
          .setDescription(eval(client.la[ls]["cmds"]["economy"]["sell"]["variable5"]))
        ]});
      
      var prize = 0;
      switch (args[0].toLowerCase()) {
        case "yacht": prize = 75000; break;
        case "lamborghini": prize = 50000; break;
        case "car": prize = 6400; break;
        case "motorbike": prize = 1500; break;
        case "bicycle": prize = 500; break;

        case "nike": prize = 300; break;
        case "tshirt": prize = 60; break;

        case "mansion": prize = 45000; break;
        case "house": prize = 8000; break;
        case "dirthut": prize = 150; break;

        case "pensil": prize = 20; break;
        case "pen": prize = 10; break;
        case "condom": prize = 30; break;
        case "bottle": prize = 50; break;

        case "fish": prize = 1000; break;
        case "hamster": prize = 1500; break;
        case "dog": prize = 2000; break;
        case "cat": prize = 2000; break;
        default: prize = false; break;
      }

      if (!prize)
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
          .setFooter(user.tag, user.displayAvatarURL({dynamic: true}))
          .setTitle(eval(client.la[ls]["cmds"]["economy"]["sell"]["variable6"]))
          .setDescription(eval(client.la[ls]["cmds"]["economy"]["sell"]["variable7"]))
          .addField("To sell items:", `\`${prefix}sell Pen 2\``)
        ]});
      if(data.items[`${args[0].toLowerCase()}`] == 0)
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(user.tag, user.displayAvatarURL({ dynamic: true }))
          .setTitle(eval(client.la[ls]["cmds"]["economy"]["sell"]["variable8"]))
          .setDescription(eval(client.la[ls]["cmds"]["economy"]["sell"]["variable9"]))
        ]});
      if (amountofbuy > data.items[`${args[0].toLowerCase()}`])
        return message.reply({embeds: [new MessageEmbed()
          .setColor(es.wrongcolor)
          .setFooter(user.tag, user.displayAvatarURL({ dynamic: true }))
          .setTitle(eval(client.la[ls]["cmds"]["economy"]["sell"]["variable10"]))
          .setDescription(eval(client.la[ls]["cmds"]["economy"]["sell"]["variable11"]))
        ]});

      var endprize = (prize * amountofbuy) * 0.9;
      
      client.economy.math(`${message.guild.id}-${user.id}`, "-", amountofbuy, `items.${args[0].toLowerCase()}`)
      client.economy.math(`${message.guild.id}-${user.id}`, "+", endprize, `balance`)
      data = client.economy.get(`${message.guild.id}-${user.id}`)

      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setFooter(user.tag, user.displayAvatarURL({ dynamic: true }))
        .setTitle(eval(client.la[ls]["cmds"]["economy"]["sell"]["variable12"]))
        .setDescription(eval(client.la[ls]["cmds"]["economy"]["sell"]["variable13"]))
      ]});
  } catch (e) {
    console.log(String(e.stack).grey.bgRed)
    return message.reply({embeds: [new MessageEmbed()
      .setColor(es.wrongcolor)
      .setFooter(client.getFooter(es))
      .setTitle(client.la[ls].common.erroroccur)
      .setDescription(eval(client.la[ls]["cmds"]["economy"]["sell"]["variable14"]))
    ]});
  }
}
};
/**
 * @INFO
 * Bot Coded by sonujana#0 | https://discord.gg/theolympus69 
 * @INFO
 * Please mention Him / Team Olympus, when using this Code
 * @INFO
 * Instagram - https://instagram.com/sonujana.ig
 */
