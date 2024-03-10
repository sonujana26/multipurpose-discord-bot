var {
  MessageEmbed
} = require(`discord.js`);
var Discord = require(`discord.js`);
var config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
var emoji = require(`${process.cwd()}/botconfig/emojis.json`);
var {
  databasing
} = require(`${process.cwd()}/handlers/functions`);
const { MessageButton, MessageActionRow, MessageSelectMenu } = require('discord.js')
module.exports = {
  name: "setup-autowarn",
  category: "💪 Setup",
  aliases: ["setupautowarn", "autowarn-setup", "autowarnsetup", "autowarnsystem"],
  cooldown: 5,
  usage: "setup-autowarn --> Follow Steps",
  description: "Enable / Disable Auto-Warn-Rules, on my Security Systems, like antispam, anticaps, antilinks, blacklist and more!",
  memberpermissions: ["ADMINISTRATOR"],
  type: "security",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language")
    try {
      client.settings.ensure(message.guild.id,{
          autowarn: {
              antispam: false,
              antiselfbot: false,
              antimention: false,
              antilinks: false,
              antidiscord: false,
              anticaps: false,
              blacklist: false,
              ghost_ping_detector: false,
          }
      })
      first_layer()
      async function first_layer(){
        function getMenuOptions(){
         
          return [
            {
              label: "Anti Spam",
              value: `antispam`,
              description: `${client.settings.get(message.guild.id, "autowarn.antispam") ? "Disable Auto warning if someone spams": "Enable Auto warning if someone spams"}`,
              emoji: `${client.settings.get(message.guild.id, "autowarn.antispam") ? "1204107662392827904": "1204107832232775730"}`,
            },
            {
              label: "Anti Mention",
              value: `antimention`,
              description: `${client.settings.get(message.guild.id, "autowarn.antimention") ? "Disable Auto warning if someone mentions": "Enable Auto warning if someone mentions"}`,
              emoji: `${client.settings.get(message.guild.id, "autowarn.antimention") ? "1204107662392827904": "1204107832232775730"}`,
            },
            {
              label: "Anti Links",
              value: `antilinks`,
              description: `${client.settings.get(message.guild.id, "autowarn.antilinks") ? "Disable Auto warning if someone send Links": "Enable Auto warning if someone send Links"}`,
              emoji: `${client.settings.get(message.guild.id, "autowarn.antilinks") ? "1204107662392827904": "1204107832232775730"}`,
            },
            {
              label: "Anti Discord",
              value: `antidiscord`,
              description: `${client.settings.get(message.guild.id, "autowarn.antidiscord") ? "Disable Auto warning if someone send Discord Links": "Enable Auto warning if someone Discord Links"}`,
              emoji: `${client.settings.get(message.guild.id, "autowarn.antidiscord") ? "1204107662392827904": "1204107832232775730"}`,
            },
            {
              label: "Anti Caps",
              value: `anticaps`,
              description: `${client.settings.get(message.guild.id, "autowarn.anticaps") ? "Disable Auto warning if someone send CAPS": "Enable Auto warning if someone send CAPS"}`,
              emoji: `${client.settings.get(message.guild.id, "autowarn.anticaps") ? "1204107662392827904": "1204107832232775730"}`,
            },
            {
              label: "Blacklist",
              value: `blacklist`,
              description: `${client.settings.get(message.guild.id, "autowarn.blacklist") ? "Disable Auto warn if someone send blacklist words": "Enable Auto warn if someone send blacklist word"}`,
              emoji: `${client.settings.get(message.guild.id, "autowarn.blacklist") ? "1204107662392827904": "1204107832232775730"}`,
            },
            {
              label: "Ghost Ping Detector",
              value: `ghost_ping_detector`,
              description: `${client.settings.get(message.guild.id, "autowarn.ghost_ping_detector") ? "Disable Auto warning if someone ghost pings": "Enable Auto warning if someone ghost pings"}`,
              emoji: `${client.settings.get(message.guild.id, "autowarn.ghost_ping_detector") ? "1204107662392827904": "1204107832232775730"}`,
            },
            {
              label: "Anti Self Bot",
              value: `antiselfbot`,
              description: `${client.settings.get(message.guild.id, "autowarn.antiselfbot") ? "Disable the Self Bot Detector": "Enable the Self Bot Detector"}`,
              emoji: `${client.settings.get(message.guild.id, "autowarn.antiselfbot") ? "1204107662392827904": "1204107832232775730"}`,
            },
          ]
        }
        let menuoptions = getMenuOptions();
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection') 
          .setMaxValues(menuoptions.length) //OPTIONAL, this is how many values you can have at each selection
          .setMinValues(1) //OPTIONAL , this is how many values you need to have at each selection
          .setPlaceholder('Select all Auto-Warn Rules you want to enable/disable') 
          .addOptions(menuoptions)
        
        //define the embed
        let MenuEmbed = new Discord.MessageEmbed()
          .setColor(es.color)
          .setAuthor('Auto-Warn Setup', 'https://cdn3.emoji.gg/emojis/8017-warning.gif')
          .setDescription('***Select all Auto-Warn Rules you want to enable/disable in the `Selection` down below!***\n> *The Warns will only be applied, if the responsible System for it, is enabled!*\n> **You must select at least 1 or more!**')
        //send the menu msg
        let menumsg = await message.reply({embeds: [MenuEmbed], components: [new MessageActionRow().addComponents(Selection)]})
        const collector = menumsg.createMessageComponentCollector({filter: (i) => i?.isSelectMenu() && i?.user && i?.message.author.id == client.user.id, time: 180e3, max: 1 });
        collector.on("collect", async b => {
          if(b?.user.id !== message.author.id)
          return b?.reply({content: ":x: Only the one who typed the Command is allowed to select Things!", ephemeral: true});
       
          let enabled = 0, disabled = 0;
          for(const value of b?.values) {
            console.log(value)
            let oldstate = client.settings.get(message.guild.id, `autowarn.${value.toLowerCase()}`);
            if(!oldstate) enabled++;
            else disabled++;
            client.settings.set(message.guild.id, !oldstate, `autowarn.${value.toLowerCase()}`)
          }
          b?.reply(`<:cx_tick:1198077126939779102> **\`Enabled ${enabled} Auto-Warn-Rules\` and \`Disabled ${disabled} Auto-Warn-Rules\` out of \`${b?.values.length} selected Auto-Warn-Rules\`**`)
        })
        collector.on('end', collected => {
          menumsg.edit({content: ":x: Time ran out/Input finished! Cancelled", embeds: [
            menumsg.embeds[0]
              .setDescription(`${getMenuOptions().map(option => `> ${option.emoji == "<a:success:1198209588869222490>" ? "<a:disabled1:1204107591286923305>": "<a:success:1198209588869222490>"} **${option.value}-Auto-Warn-Rules**: ${option.description.includes("disabled") ? `\`Now Disabled [❌]\`` : `\`Now Enabled [✅]\``}`).join("\n\n")}`)
          ], components: []}).catch((e)=>{})
        });
      }
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-warn"]["variable40"]))
      ]});
    }
  },
};
/**
 * @INFO
 * Bot Coded by sonujana#0 | https://discord.gg/theolympus69 
 * @INFO
 * Please mention Him / Team Olympus, when using this Code
 * @INFO
 * Instagram - https://instagram.com/sonujana.ig
 */
