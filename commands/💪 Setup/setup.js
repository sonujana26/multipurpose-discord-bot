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
  name: "setup",
  category: "💪 Setup",
  aliases: [""],
  cooldown: 5,
  usage: "setup  -->  Follow the Steps",
  description: "Shows all setup commands",
  memberpermissions: ["ADMINISTRATOR"],
  type: "info",
  run: async (client, message, args, cmduser, text, prefix) => {
    
    let es = client.settings.get(message.guild.id, "embed");let ls = client.settings.get(message.guild.id, "language");
    try {
      first_layer()
        async function first_layer(){
          let menuoptions = [
            {
              value: "setup-admin",
              description: `Setup Roles/Users for all/specific Admin Cmds`,
              emoji: "1205347330145128529"
            },
            {
              value: "setup-admincmdlog",
              description: `Setup a Logger for Admin Commands to a Channel`,
              emoji: "1205192382975582321"
            },
            {
              value: "setup-aichat",
              description: `Setup a fun AI-Chat System to chat with me`,
              emoji: "1206598754577285250"
            },
            {
              value: "setup-anticaps",
              description: `Setup a Anit-CAPS System to prevent CAPS-only msgs`,
              emoji: "🅰️"
            },
            {
              value: "setup-antidiscord",
              description: `Setup a Anit-DISCORD System to prevent DC-LINKS`,
              emoji: "1204249483475554314"
            },
            {
              value: "setup-antilink",
              description: `Setup a Anit-LINK System to prevent LINKS`,
              emoji: "1206599250687959051"
            },
            {
              value: "setup-antinuke",
              description: `Setup a Anit-NUKE System to prevent NUKES`,
              emoji: "1205340999488901161"
            },
            {
              value: "setup-apply",
              description: `Setup up to 25 different Apply Systems`,
              emoji: "1198081535232983111"
            },
            {
              value: "setup-autodelete",
              description: `Setup auto deletion Channels`,
              emoji: "1205343536279457833"
            },
            {
              value: "setup-autoembed",
              description: `Define Channel(s) to replace messages with EMBEDS`,
              emoji: "1206599826997903411"
            },
            {
              value: "setup-automeme",
              description: `Define a Channel to post MEMES every Minute`,
              emoji: "1206600006983749682"
            },
            {
              value: "setup-autonsfw",
              description: `Define a Channel to post NSFW every Minute`,
              emoji: "1205477751134486548"
            },
            {
              value: "setup-blacklist",
              description: `Manage the Word(s)-Blacklist`,
              emoji: "1205470545655758889"
            },
            {
              value: "setup-commands",
              description: `Enable/Disable specific Commands`,
              emoji: "1205859477405044758"
            },
            {
              value: "setup-counter",
              description: `Setup a fun Number-Counter Channel`,
              emoji: "1206600847820070955"
            },
            {
              value: "setup-customcommand",
              description: `Setup up to 25 different Custom-Commands`,
              emoji: "1204221311312723980"
            },
            {
              value: "setup-dailyfact",
              description: `Setup a Channel to post daily Facts`,
              emoji: "1206601095066165310"
            },
            {
              value: "setup-embed",
              description: `Setup the Look of the Embeded Messages`,
              emoji: "1206599826997903411"
            },
            {
              value: "setup-jtc",
              description: `Setup the Join-To-Create Channel(s)`,
              emoji: "1204113733878546432"
            },
            {
              value: "setup-keyword",
              description: `Setup up to 25 different Keyword-Messages`,
              emoji: "1206610325017993266"
            },
            {
              value: "setup-leave",
              description: `Manage the Leave Messages`,
              emoji: "1204109732290494484"
            },
            {
              value: "setup-logger",
              description: `Setup the Audit-Log`,
              emoji: "953157853026340914"
            },
            {
              value: "setup-membercount",
              description: `Setup up to 25 different Member-Counters`,
              emoji: "1205712969774792725"
            },
            {
              value: "setup-radio",
              description: `Setup the Radio/Waitingroom System`,
              emoji: "📻"
            },
            {
              value: "setup-rank",
              description: `Setup the Ranking System`,
              emoji: "1204259077316808704"
            },
            {
              value: "setup-reactionrole",
              description: `Setup Infinite Reaction Roles`,
              emoji: "1204226155436314624"
            },
            {
              value: "setup-reportlog",
              description: `Setup the Report System & Channel`,
              emoji: "1206624935431376928"
            },
            {
              value: "setup-roster",
              description: `Setup the Roster System`,
              emoji: "1205428852864581693"
            },
            {
              value: "setup-serverstats",
              description: `Setup up to 25 different Member-Counters`,
              emoji: "1206625297877700628"
            },
            {
              value: "setup-suggestion",
              description: `Setup the Suggestion System`,
              emoji: "1205341157253586964"
            },
            {
              value: "setup-ticket",
              description: `Setup up to 25 different Ticket-Systems`,
              emoji: "1206064665873088523"
            },
            {
              value: "setup-tiktok",
              description: `Setup up to 3 different TikTok Logger Channels`,
              emoji: "1206626186520956928"
            },
            {
              value: "setup-twitch",
              description: `Setup up to 5 different Twitch Logger Channels`,
              emoji: "1206626396949192704"
            },
            {
              value: "setup-twitter",
              description: `Setup up to 2 different Twitter Logger Channels`,
              emoji: "1204225095355072522"
            },
            {
              value: "setup-validcode",
              description: `Setup the Valid-Code System`,
              emoji: "1206626642722557992"
            },
            {
              value: "setup-warn",
              description: `Setup the Warn System Settings`,
              emoji: "1198208227746259095"
            },
            {
              value: "setup-welcome",
              description: `Setup the Welcome System/Messages`,
              emoji: "1206120466721542224"
            },
            {
              value: "setup-youtube",
              description: `Setup up to 5 different Youtube Logger Channels`,
              emoji: "1205753523963170828"
            },
          ]
          let Selection1 = new MessageSelectMenu()
            .setPlaceholder('Click me to setup the (1/3) Systems [A-C]!').setCustomId('MenuSelection') 
            .setMaxValues(1).setMinValues(1)
            .addOptions(
            menuoptions.map((option, index) => {
              if(index < Math.ceil(menuoptions.length/3)){
              let Obj = {
                label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                value: option.value.substring(0, 50),
                description: option.description.substring(0, 50),
              }
              if(option.emoji) Obj.emoji = option.emoji;
              return Obj;
              }
           }).filter(Boolean))
          let Selection2 = new MessageSelectMenu()
            .setPlaceholder('Click me to setup the (2/3) Systems [C-R]!').setCustomId('MenuSelection') 
            .setMaxValues(1).setMinValues(1)
            .addOptions(
            menuoptions.map((option, index) => {
              if(index >= Math.ceil(menuoptions.length/3) && index < 2*Math.ceil(menuoptions.length/3)){
                let Obj = {
                  label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                  value: option.value.substring(0, 50),
                  description: option.description.substring(0, 50),
                }
                if(option.emoji) Obj.emoji = option.emoji;
                return Obj;
              }
           }).filter(Boolean))
          let Selection3 = new MessageSelectMenu()
            .setPlaceholder('Click me to setup the (3/3) Systems [R-Z]!').setCustomId('MenuSelection') 
            .setMaxValues(1).setMinValues(1)
            .addOptions(
            menuoptions.map((option, index) => {
              if(index >= 2*Math.ceil(menuoptions.length/3)){
              let Obj = {
                label: option.label ? option.label.substring(0, 50) : option.value.substring(0, 50),
                value: option.value.substring(0, 50),
                description: option.description.substring(0, 50),
              }
            if(option.emoji) Obj.emoji = option.emoji;
            return Obj;
              }
           }).filter(Boolean))
          //define the embed
          let MenuEmbed1 = new Discord.MessageEmbed()
            .setColor(es.color)
            .setAuthor("Setup-Systems | (1/3) [A-C]", 
            "https://media.discordapp.net/attachments/1195178427465093153/1206627572365140038/Settings-icon.png")
            .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup"]["variable1"]))
          let MenuEmbed2 = new Discord.MessageEmbed()
            .setColor(es.color)
            .setAuthor("Setup-Systems | (2/3) [C-R]", 
            "https://media.discordapp.net/attachments/1195178427465093153/1206627572365140038/Settings-icon.png")
            .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup"]["variable2"]))
          let MenuEmbed3 = new Discord.MessageEmbed()
            .setColor(es.color)
            .setAuthor("Setup-Systems | (3/3) [R-Z]", 
            "https://media.discordapp.net/attachments/1195178427465093153/1206627572365140038/Settings-icon.png")
            .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup"]["variable3"]))
          //send the menu msg
          let menumsg1 = await message.reply({embeds: [MenuEmbed1], components: [new MessageActionRow().addComponents(Selection1)]})
          let menumsg2 = await message.reply({embeds: [MenuEmbed2], components: [new MessageActionRow().addComponents(Selection2)]})
          let menumsg3 = await message.reply({embeds: [MenuEmbed3], components: [new MessageActionRow().addComponents(Selection3)]})
          //function to handle the menuselection
          function menuselection(menu) {
            let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0])
            let menuoptionindex = menuoptions.findIndex(v => v.value == menu?.values[0])
            menu?.deferUpdate();
            handle_the_picks(menuoptionindex, menuoptiondata)
          }
          //Event
          client.on('interactionCreate',  (menu) => {
            if (menu?.message.id === menumsg1.id) {
              if (menu?.user.id === cmduser.id) {
                menumsg1.edit({components: [], embeds: menumsg1.embeds}).catch(() => {});
                menuselection(menu);
              }
              else menu?.reply({content: `<:cx_cross:1198077504599117834> You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true});
            }
            if (menu?.message.id === menumsg2.id) {
              if (menu?.user.id === cmduser.id) {
                menumsg2.edit({components: [], embeds: menumsg2.embeds}).catch(() => {});
                menuselection(menu);
              }
              else menu?.reply({content: `<:cx_cross:1198077504599117834> You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true});
            }
            if (menu?.message.id === menumsg3.id) {
              if (menu?.user.id === cmduser.id) {
                menumsg3.edit({components: [], embeds: menumsg3.embeds}).catch(() => {});
                menuselection(menu);
              }
              else menu?.reply({content: `<:cx_cross:1198077504599117834> You are not allowed to do that! Only: <@${cmduser.id}>`, ephemeral: true});
            }
          });
        }

        async function handle_the_picks(menuoptionindex, menuoptiondata) {
          require(`./${menuoptiondata.value.toLowerCase()}`).run(client, message, args, cmduser, text, prefix);
        }
      } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({embeds: [new MessageEmbed()
        .setColor(es.wrongcolor).setFooter(client.getFooter(es))
        .setTitle(client.la[ls].common.erroroccur)
        .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup"]["variable10"]))
      ]});
    }
  },
};