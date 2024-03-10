const {
  MessageEmbed, MessageButton, MessageActionRow, MessageSelectMenu
} = require("discord.js")
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const {
  duration, handlemsg
} = require(`${process.cwd()}/handlers/functions`)
module.exports = {
  name: "help",
  category: "🔰 Info",
  aliases: ["h", "commandinfo", "halp", "hilfe"],
  usage: "help [Command/Category]",
  description: "Returns all Commmands, or one specific command",
  type: "bot",
  run: async (client, message, args, cmduser, text, prefix) => {

    let settings = client.settings.get(message.guild.id);
    let es = client.settings.get(message.guild.id, "embed");
    let ls = client.settings.get(message.guild.id, "language");

    try {
      if (args[0]) {
        const embed = new MessageEmbed().setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null);
        const cmd = client.commands.get(args[0].toLowerCase()) || client.commands.get(client.aliases.get(args[0].toLowerCase()));
        var cat = false;
        if(args[0].toLowerCase().includes("cust")){
          let cuc = client.customcommands.get(message.guild.id, "commands");
          if (cuc.length < 1) cuc = [handlemsg(client.la[ls].cmds.info.help.error1)]
          else cuc = cuc.map(cmd => `\`${cmd.name}\``)
          const items = cuc


          const embed = new MessageEmbed()
            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
            .setThumbnail(client.user.displayAvatarURL())
            .setTitle(eval(client.la[ls]["cmds"]["info"]["help"]["variable1"]))
            .setDescription(items.join("︲"))
            .setFooter(handlemsg(client.la[ls].cmds.info.help.nocustom), client.user.displayAvatarURL());

          message.reply({embeds: [embed]})
          return;
        }var cat = false;
        if (!cmd) {
          cat = client.categories.find(cat => cat.toLowerCase().includes(args[0].toLowerCase()))
        }
        if (!cmd && (!cat || cat == null)) {
          return message.reply({embeds: [embed.setColor(es.wrongcolor).setDescription(handlemsg(client.la[ls].cmds.info.help.noinfo, {command: args[0].toLowerCase()}))]});
        } else if (cat) {
          var category = cat;
          const items = client.commands.filter((cmd) => cmd.category === category).map((cmd) => `\`${cmd.name}\``);
          const embed = new MessageEmbed()
            .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
            .setThumbnail(client.user.displayAvatarURL())
            .setTitle(eval(client.la[ls]["cmds"]["info"]["help"]["variable2"]))
            .setFooter(handlemsg(client.la[ls].cmds.info.help.nocustom, {prefix: prefix}), client.user.displayAvatarURL());
          let embeds = allotherembeds_eachcategory();
          if(cat == "🔰 Info")
            return message.reply({embeds: [embeds[0]]})
          if(cat == "💸 Economy")
            return message.reply({embeds: [embeds[1]]})
          if(cat == "🏫 School Commands")
            return message.reply({embeds: [embeds[2]]})
          if(cat == "🎶 Music")
            return message.reply({embeds: [embeds[3]]})
          if(cat == "👀 Filter")
            return message.reply({embeds: [embeds[4]]})
          if(cat == "⚜️ Custom Queue(s)")
            return message.reply({embeds: [embeds[5]]})
          if(cat == "🚫 Administration")
            return message.reply({embeds: [embeds[6]]})
          if(cat == "💪 Setup")
            return message.reply({embeds: [embeds[7]]})
          if(cat == "⚙️ Settings")
            return message.reply({embeds: [embeds[8]]})
          if(cat == "👑 Owner")
            return message.reply({embeds: [embeds[9]]})
          if(cat == "⌨️ Programming")
            return message.reply({embeds: [embeds[10]]})
          if(cat == "📈 Ranking")
            return message.reply({embeds: [embeds[11]]})
          if(cat == "🔊 Soundboard")
            return message.reply({embeds: [embeds[12]]})
          if(cat == "🎤 Voice")
            return message.reply({embeds: [embeds[13]]})
          if(cat == "🕹️ Fun")
            return message.reply({embeds: [embeds[14]]})
          if(cat == "🎮 MiniGames")
            return message.reply({embeds: [embeds[15]]})
          if(cat == "😳 Anime-Emotions")
            return message.reply({embeds: [embeds[16]]})
          if (category.toLowerCase().includes("custom")) {
            const cmd = client.commands.get(items[0].split("`").join("").toLowerCase()) || client.commands.get(client.aliases.get(items[0].split("`").join("").toLowerCase()));
            try {
              embed.setDescription(eval(client.la[ls]["cmds"]["info"]["help"]["variable3"]));
            } catch {}
          } else {
            embed.setDescription(eval(client.la[ls]["cmds"]["info"]["help"]["variable4"]))
          }
          return message.reply({embeds: [embed]})
        }
        if (cmd.name) embed.addField(handlemsg(client.la[ls].cmds.info.help.detail.name), `\`\`\`${cmd.name}\`\`\``);
        if (cmd.name) embed.setTitle(handlemsg(client.la[ls].cmds.info.help.detail.about, {cmdname: cmd.name}));
        if (cmd.description) embed.addField(handlemsg(client.la[ls].cmds.info.help.detail.desc), `\`\`\`${cmd.description}\`\`\``);
        if (cmd.aliases && cmd.aliases.length > 0 && cmd.aliases[0].length > 1) try {
          embed.addField(handlemsg(client.la[ls].cmds.info.help.detail.aliases), `\`${cmd.aliases.map((a) => `${a}`).join("`, `")}\``);
        } catch { }
        if (cmd.cooldown) embed.addField(handlemsg(client.la[ls].cmds.info.help.detail.cooldown), `\`\`\`${cmd.cooldown} Seconds\`\`\``);
        else embed.addField(handlemsg(client.la[ls].cmds.info.help.detail.cooldown), `\`\`\`3 Seconds\`\`\``);
        if (cmd.usage) {
          embed.addField(handlemsg(client.la[ls].cmds.info.help.detail.usage), `\`\`\`${prefix}${cmd.usage}\`\`\``);
          embed.setFooter(handlemsg(client.la[ls].cmds.info.help.detail.syntax), es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL());
        }
        return message.reply({embeds: [embed]});
      } else {
        let button_back = new MessageButton().setStyle('PRIMARY').setCustomId('1').setEmoji("<a:Left:1204295774469496863>").setLabel(handlemsg(client.la[ls].cmds.info.help.buttons.back))
        let button_home = new MessageButton().setStyle('PRIMARY').setCustomId('2').setEmoji("<:Homepage:1204297974835056714>").setLabel(handlemsg(client.la[ls].cmds.info.help.buttons.home))
        let button_forward = new MessageButton().setStyle('PRIMARY').setCustomId('3').setEmoji('<a:right:1204295805087784960>').setLabel(handlemsg(client.la[ls].cmds.info.help.buttons.forward))        
        let button_tutorial = new MessageButton().setStyle('LINK').setEmoji("<a:Up_Vote:1213847032079454248>").setLabel("Vote (Soon)").setURL("https://discord.com/invite/NV89UauFCk")
        let menuOptions = [
          {
            label: "Overview",
            value: "Overview",
            emoji: "1204219769029664851",
            description: "My Overview of me!"
          },
          {
            label: "Information",
            value: "Information",
            emoji: "1204120390008438808",
            description: "Commands to share Information"
          },
          {
            label: "Economy",
            value: "Economy",
            emoji: "1204220014429999105",
            description: "Commands to use the Economy System"
          },
          {
            label: "School",
            value: "School",
            emoji: "1204220227534192711",
            description: "Commands useful for School and work!"
          },
          {
            label: "Music",
            value: "Music",
            emoji: "1204220529477820547",
            description: "Commands to play Music / add Filter"
          },
          {
            label: "Filter",
            value: "Filter",
            emoji: "1204220770314747994",
            description: "Commands to add Filters to the Music"
          },
          {
            label: "Customqueue",
            value: "Customqueue",
            emoji: "1204221311312723980",
            description: "Commands to Save Queues and Manage them"
          },
          {
            label: "Admin",
            value: "Admin",
            emoji: "1204221625894043668",
            description: "Commands to Administrate the Server"
          },
          {
            label: "Setup",
            value: "Setup",
            emoji: "1204110385507209328",
            description: "Commands to Setup Systems"
          },
          {
            label: "Settings",
            value: "Settings",
            emoji: "1204222003343523840",
            description: "Commands to change Server Settings"
          },
          {
            label: "Owner",
            value: "Owner",
            emoji: "1204222206826250270",
            description: "Commands to to manage the Bot"
          },
          {
            label: "Programming",
            value: "Programming",
            emoji: "1204222495557681153",
            description: "Commands useful for Programming"
          },
          {
            label: "Ranking",
            value: "Ranking",
            emoji: "1204222726860963880",
            description: "Commands to mange and show Ranks"
          },
          {
            label: "Soundboard",
            value: "Soundboard",
            emoji: "1204222975914811472",
            description: "Commands for Voice Soundboard"
          },
          {
            label: "Voice",
            value: "Voice",
            emoji: "1204223170538774550",
            description: "Commands for Voice Channels Management"
          },
          {
            label: "Fun",
            value: "Fun",
            emoji: "1204223507731447828",
            description: "Commands for Fun (Image) uses"
          },
          {
            label: "Minigames",
            value: "Minigames",
            emoji: "1204223733582266388",
            description: "Commands for Minigames with the Bot"
          },
          {
            label: "Anime-Emotions",
            value: "Anime-Emotions",
            emoji: "1204223939979640893",
            description: "Commands to show your Emotions with Anime style"
          },
          {
            label: "Customcommand",
            value: "Customcommand",
            emoji: "1204224122352042054",
            description: "Custom Commands of this Server"
          },
        ];
        menuOptions = menuOptions.map(i=>{
          if(settings[`${i?.value.toUpperCase()}`] === undefined){
            return i; //if its not in the db, then add it
          }
          else if(settings[`${i?.value.toUpperCase()}`]){
            return i; //If its enabled then add it
          }
          else if(settings.showdisabled && settings[`${i?.value.toUpperCase()}`] === false){
            return i;
          } else {
            //return i // do not return, cause its disabled! to be shown
          }
        })
        let menuSelection = new MessageSelectMenu()
          .setCustomId("MenuSelection")
          .setPlaceholder("Click me to view Help-Menu-Category-Page(s)")
          .setMinValues(1)
          .setMaxValues(5)
        .addOptions(menuOptions.filter(Boolean))
        let buttonRow = new MessageActionRow().addComponents([button_back,button_home, button_forward, button_tutorial])
        let SelectionRow = new MessageActionRow().addComponents([menuSelection])
        const allbuttons = [buttonRow, SelectionRow]
        //define default embed
        let OverviewEmbed = new MessageEmbed()
        .setColor(es.color).setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
        .setFooter("Page Overview, Made with 💚 and JavaScript ",`https://images-ext-2.discordapp.net/external/wjzN1Pi7whWSGbXgrA-3YAYUjg8PxPBubBdfNphwGCg/%3Fsize%3D44%26quality%3Dlossless/https/cdn.discordapp.com/emojis/936918365304414219.gif`)
          .setTitle(`Information about __${client.user.username}__`)
          .addField("<:GreenArrow:1212593348280324156> __**General Stats:**__", `<:Dot:1213803414874488893>  Server Prefix:  \`${prefix}\`\n<:Dot:1213803414874488893>  Total Commands: \`${client.commands.size}\`\n<:Dot:1213803414874488893>  Total Slash Commands: \`${client.slashCommands.size}\`\n<:Dot:1213803414874488893>  [**Get Olympus**](https://discord.com/api/oauth2/authorize?client_id=1097842300526284880&permissions=8&scope=bot)  |  [**Support**](https://discord.com/invite/p3Qvxfg4rC)`)
          .addField("<a:advance_features:1204224407585824808> **__My Features__**",
          `>>> **60+ Systems, including:**\n <:admin:1213834294871597087> Antinuke & Anti-system\n <:green_Admin:1213833039206027314> Admin & Automod\n <:note_green:1213830939868667934> Advanced Music <a:Spotify:1204226778374340678>\n <:green_ticket:1213831733036847195> Ticket System\n <:Gift_Green:1213832541526687807> Giveaway System\n <a:dnk_Welcome_green:1213835279799160902> Welcome Images\n <:green_tick:1213844176072998922> Application System <:apply:1213832261078749275>\n <:role_green:1213834699924049960> Reaction Role System\n <:cash:1213835585387761727> Economy\n <:voice:1214176314488266763> Voice\n <:Green_PlayButton:1214213289899331674> Youtube Autoposter\n <:gamer:1213836973987594250> Mini-games and Fun\n          And much more!...<:FunarLime:1213838692301410326>`) 
          
        .addField("<a:green_question:1214245326404456480> **__How do you use me?__**",
`>>> **\`${prefix}setup\`** and select what you want for your server in the given modules,
you can also use **\`${prefix}setup-music\`** and **\`${prefix}setup-welcome\`**`)

/*.addField(":chart_with_upwards_trend: **__STATS:__**",
`>>> :gear: **${client.commands.map(a=>a).length} Commands**
:file_folder: on **${client.guilds.cache.size} Guilds**
⌚️ **${duration(client.uptime).map(i=> `\`${i}\``).join("︲")} Uptime**
📶 **\`${Math.floor(client.ws.ping)}ms\` Ping**
<:online:974692691298385990> **\`${Math.floor(client.ws.ping)}ms\` DB-Ping**
*/
.addField("<:GreenArrow:1212593348280324156> How to get help?", `>>> <:hyphen:1214243684434837545> Use the Buttons, to swap the Pages\n <:hyphen:1214243684434837545> Use the Menu to select all Help Pages, you want to display\n <:hyphen:1214243684434837545> For any queries/help Contact the Developer \`${prefix}dev\` `)


        //Send message with buttons
        let helpmsg = await message.reply({ 
            content: `***Click on the __Buttons__ to swap the Help-Pages***`,
            embeds: [OverviewEmbed], 
            components: allbuttons
        }).catch(e=>{
          console.log(e.stack ? String(e.stack).grey : String(e).grey)
          return message.reply(`:x: I couldn't send help? Maybe I am missing the Permission to **EMBED LINKS**`).catch(() => {})
        });
        var edited = false;
        var embeds = [OverviewEmbed]
        for(const e of allotherembeds_eachcategory(true))
          embeds.push(e)        
        let currentPage = 0;

        //create a collector for the thinggy
        const collector = helpmsg.createMessageComponentCollector({filter: (i) => (i?.isButton() || i?.isSelectMenu()) && i?.user && i?.message.author.id == client.user.id, time: 180e3 });
        //array of all embeds, here simplified just 10 embeds with numbers 0 - 9
        collector.on('collect', async b => {
          try{
            if(b?.isButton()){
            if(b?.user.id !== message.author.id)
              return b?.reply({content: handlemsg(client.la[ls].cmds.info.help.buttonerror, {prefix: prefix}), ephemeral: true});

              //page forward
              if(b?.customId == "1") {
                //b?.reply("***Swapping a PAGE FORWARD***, *please wait 2 Seconds for the next Input*", true)
                  if (currentPage !== 0) {
                    currentPage -= 1
                  } else {
                      currentPage = embeds.length - 1
                  }
              }
              //go home
              else if(b?.customId == "2"){
                //b?.reply("***Going Back home***, *please wait 2 Seconds for the next Input*", true)
                  currentPage = 0;
              } 
              //go forward
              else if(b?.customId == "3"){
                //b?.reply("***Swapping a PAGE BACK***, *please wait 2 Seconds for the next Input*", true)
                  if (currentPage < embeds.length - 1) {
                      currentPage++;
                  } else {
                      currentPage = 0
                  }
              }
              await helpmsg.edit({embeds: [embeds[currentPage]], components: allbuttons}).catch(e=>{})
              b?.deferUpdate().catch(e=>{})


            }
            if(b?.isSelectMenu()){
              //b?.reply(`***Going to the ${b?.customId.replace("button_cat_", "")} Page***, *please wait 2 Seconds for the next Input*`, true)
              //information, music, admin, settings, voice, minigames, nsfw
              let index = 0;
              let vembeds = []
              let theembeds = [OverviewEmbed, ...allotherembeds_eachcategory()];
              for(const value of b?.values){
                switch (value.toLowerCase()){
                  case "overview": index = 0; break;
                  case "information": index = 1; break;
                  case "economy": index = 2; break;
                  case "school": index = 3; break;
                  case "music": index = 4; break;
                  case "filter": index = 5; break;
                  case "customqueue": index = 6; break;
                  case "admin": index = 7; break;
                  case "setup": index = 8; break;
                  case "settings": index = 9; break;
                  case "owner": index = 10; break;
                  case "programming": index = 11; break;
                  case "ranking": index = 12; break;
                  case "soundboard": index = 13; break;
                  case "voice": index = 14; break;
                  case "fun": index = 15; break;
                  case "minigames": index = 16; break;
                  case "anime-emotions": index = 17; break;
                  case "nsfw": index = 18; break;
                  case "customcommand": index = 19; break;
                }
                vembeds.push(theembeds[index])
              }
              b?.reply({
                embeds: vembeds,
                ephemeral: true
              });
            }
          }catch (e){
            console.log(e.stack ? String(e.stack).grey : String(e).grey)
            console.log(String(e).italic.italic.grey.dim)
          }
        });

        collector.on('end', collected => {
          //array of all disabled buttons
          let d_buttonRow = new MessageActionRow().addComponents([button_back.setDisabled(true),button_home.setDisabled(true), button_forward.setDisabled(true), button_tutorial])
          const alldisabledbuttons = [d_buttonRow]
          if(!edited){
            edited = true;
            helpmsg.edit({content: handlemsg(client.la[ls].cmds.info.help.timeended, {prefix: prefix}), embeds: [helpmsg.embeds[0]], components: alldisabledbuttons}).catch((e)=>{})
          }
        });
        }        
        function allotherembeds_eachcategory(filterdisabled = false){
          //ARRAY OF EMBEDS
          var embeds = [];

          //INFORMATION COMMANDS
          var embed0 = new MessageEmbed()
            .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "<a:info:1204120390008438808> Info").size}\`] <a:info:1204120390008438808> Information Commands <a:info:1204120390008438808>`)
            .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "🔰 Info").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join(",  ")}*`)
            .addField("\u200b", "__**Sub-Categorized Commands:**__")
            .addField(`<a:users:1204230450676240395> **User Commands**`, ">>> " + client.commands.filter((cmd) => cmd.category === "🔰 Info" && cmd.type === "user").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join(",  "))
            .addField(`<a:games:1204227029114028033> **Games Related Commands**`,  ">>> " + client.commands.filter((cmd) => cmd.category === "🔰 Info" && cmd.type === "games").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join(",  "))
            .addField(`<:servers:1204230911499960422> **Server Related Commands**`,  ">>> " + client.commands.filter((cmd) => cmd.category === "🔰 Info" && cmd.type === "server").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join(",  "))
            .addField(`<:bot_flag:1204231176861261844> **Bot Related Commands**`,  ">>> " + client.commands.filter((cmd) => cmd.category === "🔰 Info" && cmd.type === "bot").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join(",  "))
            .addField(`<a:builder:1204231444365320277> **Util Related Commands**`, ">>> " + client.commands.filter((cmd) => cmd.category === "🔰 Info" && cmd.type === "util").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join(",  "))
          embeds.push(embed0)

          //ECONOMY COMMANDS
          var embed1 = new MessageEmbed()
            .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "💸 Economy").size}\`] <a:economy:1204220014429999105> Economy Commands <a:economy:1204220014429999105> | ${settings.ECONOMY ? "<:enabled:1204107832232775730> ENABLED" : "<:disabled:1204107662392827904> DISABLED"}`)
            .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "💸 Economy").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join(",  ")}*`)
            .addField("\u200b", "__**Sub-Categorized Commands:**__")
            .addField(`<:Minigames:1204223733582266388> **Mini Game to earn money**`,  ">>> " + client.commands.filter((cmd) => cmd.category === "💸 Economy" && cmd.type === "game").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join(",  "))
            .addField(`<:clock:1204234343552385095> **Repeatingly earn 💸 via Event(s)**`,  ">>> " + client.commands.filter((cmd) => cmd.category === "💸 Economy" && cmd.type === "earn").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join(",  "))
            .addField(`<:banknote:1204294205720236072> **Information & Manage **`,  ">>> " + client.commands.filter((cmd) => cmd.category === "💸 Economy" && cmd.type === "info").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join(",  "))
            if(!filterdisabled || settings.ECONOMY || settings.showdisabled) embeds.push(embed1)

          //SCHOOL COMMANDS
          var embed2 = new MessageEmbed()
            .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "🏫 School Commands").size}\`] <:School:1204220227534192711> School Commands <:School:1204220227534192711> | ${settings.SCHOOL ? "<:enabled:1204107832232775730> ENABLED" : "<:disabled:1204107662392827904> DISABLED"}`)
            .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "🏫 School Commands").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join(",  ")}*`)
            .addField("\u200b", "__**Sub-Categorized Commands:**__")
            .addField(`<a:MATHS:1204235249916317697> **Mathematics**`,  ">>> " + client.commands.filter((cmd) => cmd.category === "🏫 School Commands" && cmd.type === "math").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join(",  "))
            .addField(`<:clock:1204234343552385095> **Time Management**`,  ">>> " + client.commands.filter((cmd) => cmd.category === "🏫 School Commands" && cmd.type === "time").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join(",  "))
          if(!filterdisabled || settings.SCHOOL || settings.showdisabled) embeds.push(embed2)

          //MUSIC COMMANDS type: song, queue, queuesong, bot
          var embed3 = new MessageEmbed()
            .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "🎶 Music").size}\`] <a:Music:1204226511016693770> Music Commands <a:Music:1204226511016693770> | ${settings.MUSIC ? "<:enabled:1204107832232775730> ENABLED" : "<:disabled:1204107662392827904> DISABLED"}`)
            .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "🎶 Music").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join(",  ")}*`)
            .addField("\u200b", "__**Sub-Categorized Commands:**__")
            .addField("<:queue:1204115779776417822> **Queue Commands**", "> "+client.commands.filter((cmd) => cmd.category === "🎶 Music" && cmd.type.includes("queue")).sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join(",  "))
            .addField("<a:audio_va:1204236825791565875> **Song Commands**", "> "+client.commands.filter((cmd) => cmd.category === "🎶 Music" && cmd.type.includes("song")).sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join(",  "))
            .addField("<:bot_flag:1204231176861261844> **Bot Commands**", "> "+client.commands.filter((cmd) => cmd.category === "🎶 Music" && cmd.type.includes("bot")).sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join(",  "))
            if(!filterdisabled || settings.MUSIC || settings.showdisabled) embeds.push(embed3)

          //FILTER COMMANDS
          var embed4 = new MessageEmbed()
            .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "👀 Filter").size}\`] <a:filter:1204220770314747994> Filter Commands <a:filter:1204220770314747994> | ${settings.FILTER ? "<:enabled:1204107832232775730> ENABLED" : "<:disabled:1204107662392827904> DISABLED"}`)
            .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "👀 Filter").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join(",  ")}*`)
          if(!filterdisabled || settings.FILTER || settings.showdisabled) embeds.push(embed4)

          //CUSTOM QUEUE COMMANDS
          var embed5 = new MessageEmbed()
            .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "⚜️ Custom Queue(s)").first().extracustomdesc.length}\`] <a:custom:1204221311312723980> Custom Queue(s) Commands <a:custom:1204221311312723980> | ${settings.CUSTOMQUEUE ? "<:enabled:1204107832232775730> ENABLED" : "<:disabled:1204107662392827904> DISABLED"}`)
            .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "⚜️ Custom Queue(s)").first().extracustomdesc.split(",").map(i => i?.trim()).join(",  ")}*`)
            .addField("\u200b", "\u200b")
            .addField("<:Usage:1204239644045217912> **Usage**", "> "+client.commands.filter((cmd) => cmd.category === "⚜️ Custom Queue(s)").first().usage)
          if(!filterdisabled || settings.CUSTOMQUEUE || settings.showdisabled) embeds.push(embed5)

          //ADMINISTRATION
          var embed6 = new MessageEmbed()
            .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "🚫 Administration").size}\`] <a:Admin:1204228694793523230> Admin Commands <a:Admin:1204228694793523230>`)
            .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "🚫 Administration").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join(",  ")}*`)
            .addField("\u200b", "__**Sub-Categorized Commands:**__")
            .addField("<:servers:1204230911499960422> **Server Related Commands**", "> "+client.commands.filter((cmd) => cmd.category === "🚫 Administration" && cmd.type.includes("server")).sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join(",  "))
            .addField("<:channel:1204242537804734544> **Channel Related Commands**", "> "+client.commands.filter((cmd) => cmd.category === "🚫 Administration" && cmd.type.includes("channel")).sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join(",  "))
            .addField("<a:ThreadChannel:1204243934381875201> **Thread Related Commands**", "> "+client.commands.filter((cmd) => cmd.category === "🚫 Administration" && cmd.type.includes("thread")).sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join(",  "))
            .addField("<a:roles:1204244180399034439> **Role Related Commands**", "> "+client.commands.filter((cmd) => cmd.category === "🚫 Administration" && cmd.type.includes("role")).sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join(",  "))
            .addField("<:member:1204244433785061488> **Member Related Commands**", "> "+client.commands.filter((cmd) => cmd.category === "🚫 Administration" && cmd.type.includes("member")).sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join(",  "))
          embeds.push(embed6)

          //SETUP
          var embed7 = new MessageEmbed()
            .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "💪 Setup").size}\`] <a:setup:1204110385507209328>  Setup Commands <a:setup:1204110385507209328> `)
            .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "💪 Setup").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join(",  ")}*`)
            .addField("\u200b", "__**Sub-Categorized Commands:**__")
            .addField("<:funny:1204245056698191943> **Setups for Entertainment**", "> "+client.commands.filter((cmd) => cmd.category === "💪 Setup" && cmd.type.includes("fun")).sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join(",  "))
            .addField("<a:info:1204245337548787792> **Information & Manage (Bot/Server) Settings**", "> "+client.commands.filter((cmd) => cmd.category === "💪 Setup" && cmd.type.includes("info")).sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join(",  "))
            .addField("<:rocket:1204245644013731931> **Most used Systems**", "> "+client.commands.filter((cmd) => cmd.category === "💪 Setup" && cmd.type.includes("system")).sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join(",  "))
            .addField("<a:builder:1204231444365320277> **Security Systems**", "> "+client.commands.filter((cmd) => cmd.category === "💪 Setup" && cmd.type.includes("security")).sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join(",  "))
          embeds.push(embed7)

          //Settings
          var embed8 = new MessageEmbed()
            .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "⚙️ Settings").size}\`] <a:cb_settings:1204222003343523840> Settings Commands <a:cb_settings:1204222003343523840>`)
            .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "⚙️ Settings").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join(",  ")}*`)
            .addField("\u200b", "__**Sub-Categorized Commands:**__")
            .addField("<:member:1204244433785061488> **User Related Commands**", "> "+client.commands.filter((cmd) => cmd.category === "⚙️ Settings" && cmd.type.includes("user")).sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join(",  "))
            .addField("<:bot_flag:1204231176861261844> **Bot Related Commands**", "> "+client.commands.filter((cmd) => cmd.category === "⚙️ Settings" && cmd.type.includes("bot")).sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join(",  "))
            .addField("<a:musicop:1204220529477820547> **Music Related Commands**", "> "+client.commands.filter((cmd) => cmd.category === "⚙️ Settings" && cmd.type.includes("music")).sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join(",  "))
          embeds.push(embed8)

          //Owner
          var embed9 = new MessageEmbed()
            .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "👑 Owner").size}\`] <a:Owner:1204222206826250270> Owner Commands <a:Owner:1204222206826250270>`)
            .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "👑 Owner").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join(",   ")}*`)
            .addField("\u200b", "__**Sub-Categorized Commands:**__")
            .addField("<:discord:1204249483475554314> **Information & Manage**", "> "+client.commands.filter((cmd) => cmd.category === "👑 Owner" && cmd.type.includes("info")).sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join(",  "))
            .addField("<:bot_flag:1204231176861261844> **Adjust the Bot**", "> "+client.commands.filter((cmd) => cmd.category === "👑 Owner" && cmd.type.includes("bot")).sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join(",  "))
            embeds.push(embed9)

          //Programming Commands
          var embed10 = new MessageEmbed()
            .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "⌨️ Programming").size}\`] <:coding:1204222495557681153> Programming Commands <:coding:1204222495557681153> | ${settings.PROGRAMMING ? "<:enabled:1204107832232775730> ENABLED" : "<:disabled:1204107662392827904> DISABLED"}`)
            .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "⌨️ Programming").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join(",  ")}*`)
          if(!filterdisabled || settings.PROGRAMMING || settings.showdisabled) embeds.push(embed10)

          //Ranking
          var embed11 = new MessageEmbed()
            .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "📈 Ranking").size}\`] <a:Ranking:1204222726860963880> Ranking Commands <a:Ranking:1204222726860963880> | ${settings.RANKING ? "<:enabled:1204107832232775730> ENABLED" : "<:enabled:1204107832232775730> DISABLED"}`)
            .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "📈 Ranking").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join(",  ")}*`)
            .addField("\u200b", "__**Sub-Categorized Commands:**__")
            .addField("<a:builder:1204231444365320277> **Manage Rank**", `> ${client.commands.filter((cmd) => cmd.category === "📈 Ranking" && cmd.type === "manage").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join(",  ")}`)
            .addField("<a:rank:1204259077316808704> **Rank Information**", `> ${client.commands.filter((cmd) => cmd.category === "📈 Ranking" && cmd.type === "info").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join(",  ")}`)
          if(!filterdisabled || settings.RANKING || settings.showdisabled) embeds.push(embed11)

          //SOUNDBOARD COMMANDS
          var embed12 = new MessageEmbed()
            .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "🔊 Soundboard").size}\`] <:soundboard_:1204222975914811472> Soundboard Commands <:soundboard_:1204222975914811472> | ${settings.SOUNDBOARD ? "<:enabled:1204107832232775730> ENABLED" : "<:disabled:1204107662392827904> DISABLED"}`)
            
            .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "🔊 Soundboard").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join(",  ")}*`)

          if(!filterdisabled || settings.SOUNDBOARD || settings.showdisabled) embeds.push(embed12)

          //Voice COMMANDS
          var embed13 = new MessageEmbed()
            .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "🎤 Voice").first().extracustomdesc.length}\`] <a:VOICE:1204223170538774550> Voice Commands <a:VOICE:1204223170538774550> | ${settings.VOICE ? "<:enabled:1204107832232775730> ENABLED" : "<:disabled:1204107662392827904> DISABLED"}`)
            .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "🎤 Voice").first().extracustomdesc.split(",").map(i => i?.trim()).join(",  ")}*`)
            .addField("\u200b", "\u200b")
            .addField("<:Usage:1204239644045217912>  **Usage**", "> "+client.commands.filter((cmd) => cmd.category === "🎤 Voice").first().usage)
          if(!filterdisabled || settings.VOICE || settings.showdisabled) embeds.push(embed13)

          //FUN COMMANDS
          var embed14 = new MessageEmbed()
            .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "🕹️ Fun").size}\`] <a:fun:1204223507731447828> Fun Commands <a:fun:1204223507731447828> | ${settings.FUN ? "<:enabled:1204107832232775730> ENABLED" : "<:disabled:1204107662392827904> DISABLED"}`)
            .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "🕹️ Fun").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join(",  ")}*`)
            .addField("\u200b", "__**Sub-Categorized Commands:**__")
            .addField("<:image:1204260671798378527> **Fun User Image Commands**", "> "+client.commands.filter((cmd) => cmd.category === "🕹️ Fun" && cmd.type === "user").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join(",  "))
            .addField("<:comment:1204261159776161822> **Fun User Image-Text Commands**", "> "+client.commands.filter((cmd) => cmd.category === "🕹️ Fun" && cmd.type === "usertext").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join(",  "))
            .addField("<:comments:1204261327993049089> **Fun Text Commands**", "> "+client.commands.filter((cmd) => cmd.category === "🕹️ Fun" && cmd.type === "text").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join(",  "))
          if(!filterdisabled || settings.FUN || settings.showdisabled) embeds.push(embed14)

          //MINIGAMES
          var embed15 = new MessageEmbed()
            .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "🎮 MiniGames").size}\`] <a:games:1204227029114028033> Mini Games Commands <a:games:1204227029114028033> | ${settings.MINIGAMES ? "<:enabled:1204107832232775730> ENABLED" : "<:disabled:1204107662392827904> DISABLED"}`)
            .addField("\u200b", "__**Sub-Categorized Commands:**__")
            .addField("<:Games:1204290758006407199> **Text Based Minigames**", "> "+client.commands.filter((cmd) => cmd.category === "🎮 MiniGames" && cmd.type === "text").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join(",  "))
            .addField("<:select_button:1204291023497338892> **Button(s) Minigames**", "> "+client.commands.filter((cmd) => cmd.category === "🎮 MiniGames" && cmd.type === "buttons").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join(",  "))
            .addField("<a:voice:1204291255845265418> **Voice Minigames**", "> "+client.commands.filter((cmd) => cmd.category === "🎮 MiniGames" && cmd.type === "voice").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join(",  "))
            .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "🎮 MiniGames").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join(",  ")}*`)
          if(!filterdisabled || settings.MINIGAMES || settings.showdisabled) embeds.push(embed15)

          //ANIME EMOTIONS
          var embed16 = new MessageEmbed()
            .setTitle(`[\`${client.commands.filter((cmd) => cmd.category === "😳 Anime-Emotions").size}\`] <:AnimeEmotions:1204223939979640893> Anime Commands <:AnimeEmotions:1204223939979640893> | ${settings.ANIME ? "<:enabled:1204107832232775730> ENABLED" : "<:disabled:1204107662392827904> DISABLED"}`)
            .setDescription(`> *${client.commands.filter((cmd) => cmd.category === "😳 Anime-Emotions").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join(",  ")}*`)
            .addField("\u200b", "__**Sub-Categorized Commands:**__")
            .addField("<a:emotions:1204293004098146325> **Anime-Mention-Emotions (or Self.)**", `> ${client.commands.filter((cmd) => cmd.category === "😳 Anime-Emotions" && cmd.type === "mention").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join(",  ")}`)
            .addField("<:mendo_selfie:1204293205768536074> **Anime-Self-Emotions**", `> ${client.commands.filter((cmd) => cmd.category === "😳 Anime-Emotions" && cmd.type === "self").sort((a,b) => a.name.localeCompare(b?.name)).map((cmd) => `\`${cmd.name}\``).join(",  ")}`)
          if(!filterdisabled || settings.ANIME || settings.showdisabled) embeds.push(embed16)

          //CUSTOM COMMANDS EMBED
          var embed18 = new MessageEmbed()
          .setTitle(eval(client.la[ls]["cmds"]["info"]["help"]["variable23"]))
          let cuc = client.customcommands.get(message.guild.id, "commands");
          if (cuc.length < 1) cuc = ["NO CUSTOM COMMANDS DEFINED YET, do it with: `!setup-customcommands`"]
          else cuc = cuc.map(cmd => `\`${cmd.name}\``)
          const items = cuc
          embed18.setTitle(eval(client.la[ls]["cmds"]["info"]["help"]["variable24"]))
          embed18.setDescription(">>> " + items.join(",  "))
          embeds.push(embed18)

          return embeds.map((embed, index) => {
            return embed
            .setColor(es.color)
            .setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
            .setFooter(client.getFooter(`Page ${index + 1} / ${embeds.length}\nTo see command Descriptions and Information, type: ${config.prefix}help [CMD NAME]`, client.user.displayAvatarURL()));
          })
        }
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
