var {
  MessageEmbed, MessageButton, MessageActionRow, Permissions
} = require("discord.js"),
ms = require("ms"),

config = require(`${process.cwd()}/botconfig/config.json`),
emoji = require("../../botconfig/emojis.json"),
ee = require(`${process.cwd()}/botconfig/embed.json`),

{
  createBar,
  format,
  check_if_dj,
  databasing,
  autoplay
} = require(`${process.cwd()}/handlers/functions`),
playermanager = require("../../handlers/playermanager"),

playercreated = new Map(),
collector = false,
mi;
module.exports = (client) => {
  client.manager
    .on("playerCreate", async (player) => {
      playercreated.set(player.guild)
    })
    .on("playerMove", async (player, oldChannel, newChannel) => {
      if (!newChannel) {
        await player.destroy();
      } else {
        player.voiceChannel = newChannel;
        if (player.paused) return;
        setTimeout(() => {
          player.pause(true);
          setTimeout(() => player.pause(false), client.ws.ping * 2);
        }, client.ws.ping * 2);
      }
    })
    .on("playerDestroy", async (player) => {
      
      if(player.textChannel && player.guild){
        let Queuechannel = client.channels.cache.get(player.textChannel);
        if(Queuechannel && Queuechannel.permissionsFor(Queuechannel.guild.me).has(Permissions.FLAGS.SEND_MESSAGES)){
          Queuechannel.messages.fetch(player.get("currentmsg")).then(currentSongPlayMsg => {
            if(currentSongPlayMsg && currentSongPlayMsg.embeds && currentSongPlayMsg.embeds[0]){
              var embed = currentSongPlayMsg.embeds[0];
              embed.author.iconURL = "https://cdn.discordapp.com/attachments/883978730261860383/883978741892649000/847032838998196234.png"
              embed.footer.text += "\n\n⛔️ SONG & QUEUE ENDED! | Player got DESTROYED (stopped)"
              currentSongPlayMsg.edit({embeds: [embed], components: []}).catch(() => {})
            }
          }).catch(() => {})
        }
        if(client.musicsettings.get(player.guild, "channel") && client.musicsettings.get(player.guild, "channel").length > 5){
          let messageId = client.musicsettings.get(player.guild, "message");
          let guild = client.guilds.cache.get(player.guild);
          if(!guild) return 
          let channel = guild.channels.cache.get(client.musicsettings.get(player.guild, "channel"));
          if(!channel) return 
          let message = channel.messages.cache.get(messageId);
          if(!message) message = await channel.messages.fetch(messageId).catch(()=>{});
          if(!message) return
          //edit the message so that it's right!
          var data = require("./musicsystem").generateQueueEmbed(client, player.guild, true)
          message.edit(data).catch(() => {})
          if(client.musicsettings.get(player.guild, "channel") == player.textChannel){
            return;
          }
        }
      }
      
    })
    .on("trackStart", async (player, track) => {
      try {
        let edited = false;
        if(playercreated.has(player.guild)){
          player.set("eq", "💣 None");
          player.set("filter", "🧨 None");
          client.settings.ensure(player.guild, {
            defaultvolume: 10,
            defaulteq: false,
            defaultap: true,
            playmsg: true,
          });
          await player.setVolume(client.settings.get(player.guild, "defaultvolume"))
          await player.set("autoplay", client.settings.get(player.guild, "defaultap"));
          await player.set(`afk`, false)
          if(client.settings.get(player.guild, "defaulteq")){
            await player.setEQ(client.eqs.music);
          }
          databasing(client, player.guild, player.get("playerauthor"));
          playercreated.delete(player.guild); // delete the playercreated state from the thing
        }
        if(client.musicsettings.get(player.guild, "channel") && client.musicsettings.get(player.guild, "channel").length > 5){
          let messageId = client.musicsettings.get(player.guild, "message");
          let guild = client.guilds.cache.get(player.guild);
          if(!guild) return 
          let channel = guild.channels.cache.get(client.musicsettings.get(player.guild, "channel"));
          if(!channel) return 
          let message = channel.messages.cache.get(messageId);
          if(!message) message = await channel.messages.fetch(messageId).catch(()=>{});
          if(!message) return
          //edit the message so that it's right!
          var data = require("./musicsystem").generateQueueEmbed(client, player.guild)
          message.edit(data).catch(() => {})
          if(client.musicsettings.get(player.guild, "channel") == player.textChannel){
            return;
          }
        }
        if(player.textChannel && player.get("previoustrack")){
          if(!collector.ended){
            try{
              collector.stop()
            } catch (e) {
              console.log(e.stack ? String(e.stack).grey : String(e).grey)
            }
          }
          let channel = client.channels.cache.get(player.textChannel);
          if(channel && channel.permissionsFor(channel.guild.me).has(Permissions.FLAGS.SEND_MESSAGES)){
            channel.messages.fetch(player.get("currentmsg")).then(currentSongPlayMsg => {
              if(currentSongPlayMsg && currentSongPlayMsg.embeds && currentSongPlayMsg.embeds[0]){
                var embed = currentSongPlayMsg.embeds[0];
                embed.author.iconURL = "https://cdn.discordapp.com/attachments/883978730261860383/883978741892649000/847032838998196234.png"
                embed.footer.text += "\n⛔️ SONG ENDED!"
                currentSongPlayMsg.edit({embeds: [embed], components: []}).catch(() => {})
              }
            }).catch(() => {})
          }
        }
        //votes for skip --> 0
        player.set("votes", "0");
        //set the vote of every user to FALSE so if they voteskip it will vote skip and not remove voteskip if they have voted before bruh
        for (var userid of client.guilds.cache.get(player.guild).members.cache.map(member => member.user.id))
          player.set(`vote-${userid}`, false);
        //set the previous track just have it is used for the autoplay function!
        player.set("previoustrack", track);
        //if that's disabled return
        if(!client.settings.get(player.guild, "playmsg")){
          return;
        }
        // playANewTrack(client,player,track);
        let playdata = generateQueueEmbed(client, player, track)
        //Send message with buttons
        let channel = client.channels.cache.get(player.textChannel);
        if(channel && channel.permissionsFor(channel.guild.me).has(Permissions.FLAGS.SEND_MESSAGES)){
          let swapmsg = await channel.send(playdata).then(msg => {
            player.set("currentmsg", msg.id);
            return msg;
          })
          //create a collector for the thinggy
          collector = swapmsg.createMessageComponentCollector({filter: (i) => i?.isButton() && i?.user && i?.message.author.id == client.user.id, time: track.duration > 0 ? track.duration : 600000 }); //collector for 5 seconds
          //array of all embeds, here simplified just 10 embeds with numbers 0 - 9
          collector.on('collect', async i => {
              let { member } = i;
              const { channel } = member.voice
              const player = client.manager.players.get(i?.guild.id);
              if (!player)
                return i?.reply({content: "<a:No:1156196552373702656> Nothing Playing yet", ephemeral: true})
                
              if (!channel)
                return i?.reply({
                  content: `<a:No:1156196552373702656> **Please join a Voice Channel first!**`,
                  ephemeral: true
                })                  
              if (channel.id !== player.voiceChannel)
                return i?.reply({
                  content: `<a:No:1156196552373702656> **Please join __my__ Voice Channel first! <#${player.voiceChannel}>**`,
                  ephemeral: true
                })
              
              if(i?.customId != `10` && check_if_dj(client, i?.member, player.queue.current)) {
                return i?.reply({embeds: [new MessageEmbed()
                  .setColor(ee.wrongcolor)
                  .setFooter({text: `${ee.footertext}`, iconURL: `${ee.footericon}`})
                  .setTitle(`<a:No:1156196552373702656> **You are not a DJ and not the Song Requester!**`)
                  .setDescription(`**DJ-ROLES:**\n${check_if_dj(client, i?.member, player.queue.current)}`)
                ],
                ephemeral: true});
              }

              
              //skip
              if(i?.customId == "1") {
                //if ther is nothing more to skip then stop music and leave the Channel
                if (player.queue.size == 0) {
                  //if its on autoplay mode, then do autoplay before leaving...
                  if(player.get("autoplay")) return autoplay(client, player, "skip");
                  i?.reply({
                    embeds: [new MessageEmbed()
                    .setColor(ee.color)
                    .setTimestamp()
                    .setTitle(`<:leave:1204109732290494484> **Stopped playing and left the Channel**`)
                    .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                  })
                  edited = true;
                  player.destroy()
                  return
                }
                //skip the track
                player.stop();
                return i?.reply({
                  embeds: [new MessageEmbed()
                  .setColor(ee.color)
                  .setTimestamp()
                  .setTitle(`<:nixon_skip:1205763264261267496> **Skipped to the next Song!**`)
                  .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                })
              }



              //stop
              if(i?.customId == "2") {
                //Stop the player
                i?.reply({
                  embeds: [new MessageEmbed()
                  .setColor(ee.color)
                  .setTimestamp()
                  .setTitle(`<:leave:1204109732290494484> **Stopped playing and left the Channel**`)
                  .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                }) 
                edited = true;
                player.destroy()
              }



              //pause/resume
              if(i?.customId == "3") {
                if (!player.playing){
                  player.pause(false);
                  i?.reply({
                    embeds: [new MessageEmbed()
                    .setColor(ee.color)
                    .setTimestamp()
                    .setTitle(`<:resume:1204111036077187152> **Resumed!**`)
                    .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                  })
                } else{
                  //pause the player
                  player.pause(true);

                  i?.reply({
                    embeds: [new MessageEmbed()
                    .setColor(ee.color)
                    .setTimestamp()
                    .setTitle(`<:red_pause:1204111312028827678> **Paused!**`)
                    .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                  })
                }
                var data = generateQueueEmbed(client, player, track)
                swapmsg.edit(data).catch((e) => {
                  //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                })
              }



              //autoplay
              if(i?.customId == "4") {
                //pause the player
                player.set(`autoplay`, !player.get(`autoplay`))
                var data = generateQueueEmbed(client, player, track)
                swapmsg.edit(data).catch((e) => {
                  //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                })
                i?.reply({
                  embeds: [new MessageEmbed()
                  .setColor(ee.color)
                  .setTimestamp()
                  .setTitle(`${player.get(`autoplay`) ? `<a:yes:833101995723194437> **Enabled Autoplay**`: `<a:No:1156196552373702656> **Disabled Autoplay**`}`)
                  .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                })
              }


              //Shuffle
              if(i?.customId == `5`){
                //set into the player instance an old Queue, before the shuffle...
                player.set(`beforeshuffle`, player.queue.map(track => track));
                //shuffle the Queue
                player.queue.shuffle();
                //Send Success Message
                i?.reply({
                  embeds: [new MessageEmbed()
                    .setColor(ee.color)
                    .setTimestamp()
                    .setTitle(`<:shuffle_button:1204115285544665118> **Shuffled ${player.queue.length} Songs!**`)
                    .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                })
              }


              //Songloop
              if(i?.customId == `6`){
                //if there is active queue loop, disable it + add embed information
                if (player.queueRepeat) {
                  player.setQueueRepeat(false);
                }
                //set track repeat to revers of old track repeat
                player.setTrackRepeat(!player.trackRepeat);
                i?.reply({
                  embeds: [new MessageEmbed()
                  .setColor(ee.color)
                  .setTimestamp()
                  .setTitle(`${player.trackRepeat ? `<a:Yes:1156196509029761034> **Enabled Song Loop**`: `<a:No:1156196552373702656> **Disabled Song Loop**`}`)
                  .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                })
                var data = generateQueueEmbed(client, player, track)
                swapmsg.edit(data).catch((e) => {
                  //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                })
              }


              //QueueLoop
              if(i?.customId == `7`){
                //if there is active queue loop, disable it + add embed information
                if (player.trackRepeat) {
                  player.setTrackRepeat(false);
                }
                //set track repeat to revers of old track repeat
                player.setQueueRepeat(!player.queueRepeat);
                i?.reply({
                  embeds: [new MessageEmbed()
                  .setColor(ee.color)
                  .setTimestamp()
                  .setTitle(`${player.queueRepeat ? `<a:Yes:1156196509029761034> **Enabled Queue Loop**`: `<a:No:1156196552373702656> **Disabled Queue Loop**`}`)
                  .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                })
                var data = generateQueueEmbed(client, player, track)
                swapmsg.edit(data).catch((e) => {
                  //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                })
              }


              //Forward
              if(i?.customId == `8`){
                //get the seektime variable of the user input
                let seektime = Number(player.position) + 10 * 1000;
                //if the userinput is smaller then 0, then set the seektime to just the player.position
                if (10 <= 0) seektime = Number(player.position);
                //if the seektime is too big, then set it 1 sec earlier
                if (Number(seektime) >= player.queue.current.duration) seektime = player.queue.current.duration - 1000;
                //seek to the new Seek position
                player.seek(Number(seektime));
                collector.resetTimer({time: (player.queue.current.duration - player.position) * 1000})
                i?.reply({
                  embeds: [new MessageEmbed()
                    .setColor(ee.color)
                    .setTimestamp()
                    .setTitle(`<:forward:1205765429298073671> **Forwarded the song for \`10 Seconds\`!**`)
                    .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                })
              }

              
              //Rewind
              if(i?.customId == `9`){
                let seektime = player.position - 10 * 1000;
                if (seektime >= player.queue.current.duration - player.position || seektime < 0) {
                  seektime = 0;
                }
                //seek to the new Seek position
                player.seek(Number(seektime));
                collector.resetTimer({time: (player.queue.current.duration - player.position) * 1000})
                i?.reply({
                  embeds: [new MessageEmbed()
                    .setColor(ee.color)
                    .setTimestamp()
                    .setTitle(`<:rewind:1205765298188329001> **Rewinded the song for \`10 Seconds\`!**`)
                    .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                })
              }
          });  
        }
                
      } catch (e) {
        console.log(String(e.stack).grey.yellow) /* */
      }
    })
    .on("trackStuck", async (player, track, payload) => {
      await player.stop();
      if(player.textChannel){
        let channel = client.channels.cache.get(player.textChannel);
        if(channel && channel.permissionsFor(channel.guild.me).has(Permissions.FLAGS.SEND_MESSAGES)){
          channel.messages.fetch(player.get("currentmsg")).then(currentSongPlayMsg => {
            if(currentSongPlayMsg && currentSongPlayMsg.embeds && currentSongPlayMsg.embeds[0]){
              var embed = currentSongPlayMsg.embeds[0];
              embed.author.iconURL = "https://cdn.discordapp.com/attachments/883978730261860383/883978741892649000/847032838998196234.png"
              embed.footer.text += "\n⚠️⚠️⚠️ SONG STUCKED ⚠️⚠️!"
              currentSongPlayMsg.edit({embeds: [embed], components: []}).catch(() => {})
            }
          }).catch(() => {})
        }
        if(client.musicsettings.get(player.guild, "channel") && client.musicsettings.get(player.guild, "channel").length > 5){
          let messageId = client.musicsettings.get(player.guild, "message");
          let guild = client.guilds.cache.get(player.guild);
          if(!guild) return 
          let channel = guild.channels.cache.get(client.musicsettings.get(player.guild, "channel"));
          if(!channel) return 
          let message = channel.messages.cache.get(messageId);
          if(!message) message = await channel.messages.fetch(messageId).catch(()=>{});
          if(!message) return
          //edit the message so that it's right!
          var data = require("./musicsystem").generateQueueEmbed(client, player.guild)
          message.edit(data).catch(() => {})
          if(client.musicsettings.get(player.guild, "channel") == player.textChannel){
            return;
          }
        }
      }
    })
    .on("trackError", async (player, track, payload) => {
      await player.stop();
      if(player.textChannel){
        let channel = client.channels.cache.get(player.textChannel);
        if(channel && channel.permissionsFor(channel.guild.me).has(Permissions.FLAGS.SEND_MESSAGES)){
          channel.messages.fetch(player.get("currentmsg")).then(currentSongPlayMsg => {
            if(currentSongPlayMsg && currentSongPlayMsg.embeds && currentSongPlayMsg.embeds[0]){
              var embed = currentSongPlayMsg.embeds[0];
              embed.author.iconURL = "https://cdn.discordapp.com/attachments/883978730261860383/883978741892649000/847032838998196234.png"
              embed.footer.text += "\n⚠️⚠️⚠️ SONG CRASHED ⚠️⚠️!"
              currentSongPlayMsg.edit({embeds: [embed], components: []}).catch(() => {})
            }
          }).catch(() => {})
        }
        if(client.musicsettings.get(player.guild, "channel") && client.musicsettings.get(player.guild, "channel").length > 5){
          let messageId = client.musicsettings.get(player.guild, "message");
          let guild = client.guilds.cache.get(player.guild);
          if(!guild) return 
          let channel = guild.channels.cache.get(client.musicsettings.get(player.guild, "channel"));
          if(!channel) return 
          let message = channel.messages.cache.get(messageId);
          if(!message) message = await channel.messages.fetch(messageId).catch(()=>{});
          if(!message) return
          //edit the message so that it's right!
          var data = require("./musicsystem").generateQueueEmbed(client, player.guild)
          message.edit(data).catch(() => {})
          if(client.musicsettings.get(player.guild, "channel") == player.textChannel){
            return;
          }
        }
      }
    })
    .on("queueEnd", async (player) => {
      databasing(client, player.guild, player.get("playerauthor"));
      if (player.get("autoplay")) return autoplay(client, player);
      //DEvar TIME OUT
      try {
        player = client.manager.players.get(player.guild);
        if (!player.queue || !player.queue.current) {
          if(client.musicsettings.get(player.guild, "channel") && client.musicsettings.get(player.guild, "channel").length > 5){
            let messageId = client.musicsettings.get(player.guild, "message");
            let guild = client.guilds.cache.get(player.guild);
            if(!guild) return 
            let channel = guild.channels.cache.get(client.musicsettings.get(player.guild, "channel"));
            if(!channel) return 
            let message = channel.messages.cache.get(messageId);
            if(!message) message = await channel.messages.fetch(messageId).catch(()=>{});
            if(!message) return
            //edit the message so that it's right!
            var data = require("./musicsystem").generateQueueEmbed(client, player.guild, true)
            message.edit(data).catch(() => {})
          }
          //if afk is enbaled return and not destroy the PLAYER
          if (player.get(`afk`)){
            return 
          }
          await player.destroy();
          
        }
      } catch (e) {
        console.log(String(e.stack).grey.yellow);
      }
    });
};



function generateQueueEmbed(client, player, track){
var embed = new MessageEmbed().setColor(ee.color)
  embed.setAuthor(`${track.title}`, "https://cdn.discordapp.com/emojis/1213684972326752299.gif", track.uri)
  embed.setThumbnail(`https://img.youtube.com/vi/${track.identifier}/mqdefault.jpg`)
  embed.setFooter(client.getFooter(`Requested by: ${track.requester.tag}`, track.requester.displayAvatarURL({dynamic: true})));
let skip = new MessageButton().setStyle('PRIMARY').setCustomId('1').setEmoji(`1157591921594736711`).setLabel(`Skip`)
let stop = new MessageButton().setStyle('DANGER').setCustomId('2').setEmoji(`1157587784211628084`).setLabel(`Stop`)
let pause = new MessageButton().setStyle('SECONDARY').setCustomId('3').setEmoji('1157590387423186985').setLabel(`Pause`)
let autoplay = new MessageButton().setStyle('SUCCESS').setCustomId('4').setEmoji('1157590582068269067').setLabel(`Autoplay`)
let shuffle = new MessageButton().setStyle('PRIMARY').setCustomId('5').setEmoji('1157588964308418560').setLabel(`Shuffle`)
if (!player.playing) {
  pause = pause.setStyle('SUCCESS').setEmoji('1157590857357209720').setLabel(`Resume`)
}
if (player.get("autoplay")) {
  autoplay = autoplay.setStyle('SECONDARY')
}
let songloop = new MessageButton().setStyle('SUCCESS').setCustomId('6').setEmoji(`1157587956148752475`).setLabel(`Song`)
let queueloop = new MessageButton().setStyle('SUCCESS').setCustomId('7').setEmoji(`1157589838296514573`).setLabel(`Queue`)
let forward = new MessageButton().setStyle('PRIMARY').setCustomId('8').setEmoji('1157593613123977306').setLabel(`+10 Sec`)
let rewind = new MessageButton().setStyle('PRIMARY').setCustomId('9').setEmoji('1157593717348249682').setLabel(`-10 Sec`)
let lyrics = new MessageButton().setStyle('PRIMARY').setCustomId('10').setEmoji('📝').setLabel(`Lyrics`).setDisabled();
if (!player.queueRepeat && !player.trackRepeat) {
  songloop = songloop.setStyle('SUCCESS')
  queueloop = queueloop.setStyle('SUCCESS')
}
if (player.trackRepeat) {
  songloop = songloop.setStyle('SECONDARY')
  queueloop = queueloop.setStyle('SUCCESS')
}
if (player.queueRepeat) {
  songloop = songloop.setStyle('SUCCESS')
  queueloop = queueloop.setStyle('SECONDARY')
}
const row = new MessageActionRow().addComponents([skip, stop, pause, autoplay, shuffle]);
const row2 = new MessageActionRow().addComponents([songloop, queueloop, forward, rewind, lyrics]);
return {
  embeds: [embed], 
  components: [row, row2]
}
}