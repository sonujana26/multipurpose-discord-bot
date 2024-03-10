const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js")
const { check_if_dj, autoplay, escapeRegex, format, duration, createBar } = require("../functions");
const config = require(`${process.cwd()}/botconfig/config.json`);
const ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const playermanager = require(`../../handlers/playermanager`);
//we need to create the music system, somewhere...
module.exports = client => {
    client.on("interactionCreate", async (interaction) => {
        if(!interaction?.isButton()) return;
        var { guild, message, channel, member, user } = interaction;
        if(!guild) guild = client.guilds.cache.get(interaction?.guildId);
        if(!guild) return;
        client.musicsettings.ensure(guild.id, {
            "channel": "",
            "message": ""
        })
        var data = client.musicsettings.get(guild.id);
        var musicChannelId = data.channel;
        var musicChannelMessage = data.message;
        //if not setupped yet, return
        if(!musicChannelId || musicChannelId.length < 5) return;
        if(!musicChannelMessage || musicChannelMessage.length < 5) return;
        //if the channel doesnt exist, try to get it and the return if still doesnt exist
        if(!channel) channel = guild.channels.cache.get(interaction?.channelId);
        if(!channel) return;
        //if not the right channel return
        if(musicChannelId != channel.id) return;
        //if not the right message, return
        if(musicChannelMessage != message.id) return;

        if(!member) member = guild.members.cache.get(user.id);
        if(!member) member = await guild.members.fetch(user.id).catch(() => {});
        if(!member) return;
        //if the member is not connected to a vc, return
        if(!member.voice.channel) return interaction?.reply({ephemeral: true, content: "<a:No:1156196552373702656> **Please Connect to a Voice Channel first!**"})
        //now its time to start the music system
        if (!member.voice.channel)
            return interaction?.reply({
                content: `<a:No:1156196552373702656> **Please join a Voice Channel first!**`,
                ephemeral: true
            })      
            
        var player = client.manager.players.get(interaction?.guild.id);
        if (interaction?.customId != "Join" && interaction?.customId != "Leave" && (!player || !player.queue || !player.queue.current))
            return interaction?.reply({content: "<a:No:1156196552373702656> Nothing Playing yet", ephemeral: true})
                        
        //if not connected to the same voice channel, then make sure to connect to it!
        if (player && member.voice.channel.id !== player.voiceChannel)
            return interaction?.reply({
                content: `<a:No:1156196552373702656> **Please join __my__ Voice Channel first! <#${player.voiceChannel}>**`,
                ephemeral: true
            })
        //here i use my check_if_dj function to check if he is a dj if not then it returns true, and it shall stop!
        if(player && interaction?.customId != `Join` && interaction?.customId != `Lyrics` && check_if_dj(client, member, player.queue.current)) {
                return interaction?.reply({embeds: [new MessageEmbed()
                  .setColor(ee.wrongcolor)
                  .setFooter({text: `${ee.footertext}`, iconURL: `${ee.footericon}`})
                  .setTitle(`<a:No:1156196552373702656> **You are not a DJ and not the Song Requester!**`)
                  .setDescription(`**DJ-ROLES:**\n${check_if_dj(client, interaction?.member, player.queue.current)}`)
                ],
                ephemeral: true});
        }
        let es = client.settings.get(guild.id, "embed")
        let ls = client.settings.get(guild.id, "language")
        switch(interaction?.customId){
            case "Join": {
                //create the player
                var player = await client.manager.create({
                    guild: guild.id,
                    voiceChannel: member.voice.channel.id,
                    textChannel: channel.id,
                    selfDeafen: config.settings.selfDeaf,
                });
                await player.connect();
                await player.stop();
                 interaction?.reply({embeds: [new MessageEmbed()
                    .setColor(es.color)
                    .setTitle(client.la[ls].cmds.music.join.title)
                    .setDescription(`Channel: <#${member.voice.channel.id}>`)]
                });
                //edit the message so that it's right!
                var data = generateQueueEmbed(client, guild.id)
                message.edit(data).catch((e) => {
                  //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                })
            }break;
            case "Leave": {
                //Stop the player
                interaction?.reply({
                  embeds: [new MessageEmbed()
                  .setColor(ee.color)
                  .setTimestamp()
                  .setTitle(`<:leave:1204109732290494484> **Left the Channel**`)
                  .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                }) 
                if(player){
                    await player.destroy();
                    //edit the message so that it's right!
                    var data = generateQueueEmbed(client, guild.id, true)
                    message.edit(data).catch((e) => {
                      //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                    })
                } else {
                    //edit the message so that it's right!
                    var data = generateQueueEmbed(client, guild.id, true)
                    message.edit(data).catch((e) => {
                    //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                    })
                }
            }break;
            case "Skip": {
                //if ther is nothing more to skip then stop music and leave the Channel
                if (!player.queue || !player.queue.size || player.queue.size === 0) {
                    //if its on autoplay mode, then do autoplay before leaving...
                    if(player.get("autoplay")) return autoplay(client, player, "skip");
                    interaction?.reply({
                        embeds: [new MessageEmbed()
                        .setColor(ee.color)
                        .setTimestamp()
                        .setTitle(`<:leave:1204109732290494484> **Stopped playing and left the Channel**`)
                        .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                    })
                    await player.destroy()
                    //edit the message so that it's right!
                    var data = generateQueueEmbed(client, guild.id, true)
                    message.edit(data).catch((e) => {
                    //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                    })
                    return
                }
                //skip the track
                await player.stop();
                interaction?.reply({
                  embeds: [new MessageEmbed()
                  .setColor(ee.color)
                  .setTimestamp()
                  .setTitle(`<:nixon_skip:1205763264261267496> **Skipped to the next Song!**`)
                  .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                })
                //edit the message so that it's right!
                var data = generateQueueEmbed(client, guild.id)
                message.edit(data).catch((e) => {
                  //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                })
            }break;
            case "Stop": {
                //Stop the player
                interaction?.reply({
                  embeds: [new MessageEmbed()
                  .setColor(ee.color)
                  .setTimestamp()
                  .setTitle(`<:leave:1204109732290494484> **Stopped playing and left the Channel**`)
                  .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                }) 
                await player.destroy()
                //edit the message so that it's right!
                var data = generateQueueEmbed(client, guild.id, true)
                message.edit(data).catch((e) => {
                  //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                })
            }break;
            case "Pause": {
                if (!player.playing){
                    player.pause(false);
                    interaction?.reply({
                      embeds: [new MessageEmbed()
                      .setColor(ee.color)
                      .setTimestamp()
                      .setTitle(`<:resume:1204111036077187152> **Resumed!**`)
                      .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                    })
                  } else{
                    //pause the player
                    player.pause(true);

                    interaction?.reply({
                      embeds: [new MessageEmbed()
                      .setColor(ee.color)
                      .setTimestamp()
                      .setTitle(`<:red_pause:1204111312028827678> **Paused!**`)
                      .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                    })
                  }
                  //edit the message so that it's right!
                  var data = generateQueueEmbed(client, guild.id)
                  message.edit(data).catch((e) => {
                    //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                  })
            }break;
            case "Autoplay": {
                //pause the player
                player.set(`autoplay`, !player.get(`autoplay`))
                interaction?.reply({
                  embeds: [new MessageEmbed()
                  .setColor(ee.color)
                  .setTimestamp()
                  .setTitle(`${player.get(`autoplay`) ? `<a:yes:833101995723194437> **Enabled Autoplay**`: `<a:No:1156196552373702656> **Disabled Autoplay**`}`)
                  .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                })
                //edit the message so that it's right!
                var data = generateQueueEmbed(client, guild.id)
                message.edit(data).catch((e) => {
                  //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                })
            }break;
            case "Shuffle": {
                //set into the player instance an old Queue, before the shuffle...
                player.set(`beforeshuffle`, player.queue.map(track => track));
                //shuffle the Queue
                player.queue.shuffle();
                //Send Success Message
                interaction?.reply({
                  embeds: [new MessageEmbed()
                    .setColor(ee.color)
                    .setTimestamp()
                    .setTitle(`<:shuffle_button:1204115285544665118> **Shuffled ${player.queue.length} Songs!**`)
                    .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                })
                //edit the message so that it's right!
                var data = generateQueueEmbed(client, guild.id)
                message.edit(data).catch((e) => {
                  //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                })
            }break;
            case "Song": {
                //if there is active queue loop, disable it + add embed information
                if (player.queueRepeat) {
                  player.setQueueRepeat(false);
                }
                //set track repeat to revers of old track repeat
                player.setTrackRepeat(!player.trackRepeat);
                interaction?.reply({
                  embeds: [new MessageEmbed()
                  .setColor(ee.color)
                  .setTimestamp()
                  .setTitle(`${player.trackRepeat ? `<a:yes:833101995723194437> **Enabled Song Loop**`: `<a:No:1156196552373702656> **Disabled Song Loop**`}`)
                  .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                })
                //edit the message so that it's right!
                var data = generateQueueEmbed(client, guild.id)
                message.edit(data).catch((e) => {
                  //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                })
            }break;
            case "Queue": {
                //if there is active queue loop, disable it + add embed information
                if (player.trackRepeat) {
                  player.setTrackRepeat(false);
                }
                //set track repeat to revers of old track repeat
                player.setQueueRepeat(!player.queueRepeat);
                interaction?.reply({
                  embeds: [new MessageEmbed()
                  .setColor(ee.color)
                  .setTimestamp()
                  .setTitle(`${player.queueRepeat ? `<a:yes:833101995723194437> **Enabled Queue Loop**`: `<a:No:1156196552373702656> **Disabled Queue Loop**`}`)
                  .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                })
                //edit the message so that it's right!
                var data = generateQueueEmbed(client, guild.id)
                message.edit(data).catch((e) => {
                  //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                })
            }break;
            case "Forward": {
                //get the seektime variable of the user input
                var seektime = Number(player.position) + 10 * 1000;
                //if the userinput is smaller then 0, then set the seektime to just the player.position
                if (10 <= 0) seektime = Number(player.position);
                //if the seektime is too big, then set it 1 sec earlier
                if (Number(seektime) >= player.queue.current.duration) seektime = player.queue.current.duration - 1000;
                //seek to the new Seek position
                await player.seek(Number(seektime));
                interaction?.reply({
                  embeds: [new MessageEmbed()
                    .setColor(ee.color)
                    .setTimestamp()
                    .setTitle(`<:forward:1205765429298073671> **Forwarded the song for \`10 Seconds\`!**`)
                    .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                })
                //edit the message so that it's right!
                var data = generateQueueEmbed(client, guild.id)
                message.edit(data).catch((e) => {
                  //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                })
            }break;
            case "Rewind": {
                var seektime = player.position - 10 * 1000;
                if (seektime >= player.queue.current.duration - player.position || seektime < 0) {
                  seektime = 0;
                }
                //seek to the new Seek position
                await player.seek(Number(seektime));
                interaction?.reply({
                  embeds: [new MessageEmbed()
                    .setColor(ee.color)
                    .setTimestamp()
                    .setTitle(`<:rewind:1205765298188329001> **Rewinded the song for \`10 Seconds\`!**`)
                    .setFooter(client.getFooter(`💢 Action by: ${member.user.tag}`, member.user.displayAvatarURL({dynamic: true})))]
                })
                //edit the message so that it's right!
                var data = generateQueueEmbed(client, guild.id)
                message.edit(data).catch((e) => {
                  //console.log(e.stack ? String(e.stack).grey : String(e).grey)
                })
            }break;
            case "Lyrics": {
                
            }break;
        }
        
    })
    //this was step 1 now we need to code the REQUEST System...

    client.on("messageCreate", async message => {
        if(!message.guild) return;
        client.musicsettings.ensure(message.guild.id, {
            "channel": "",
            "message": ""
        })
        var data = client.musicsettings.get(message.guild.id);
        var musicChannelId = data.channel;
        //if not setupped yet, return
        if(!musicChannelId || musicChannelId.length < 5) return;
        //if not the right channel return
        if(musicChannelId != message.channel.id) return;
        //Delete the message once it got sent into the channel, bot messages after 5 seconds, user messages instantly!
        if (message.author.id === client.user.id) 
            setTimeout(()=>{
              try{
                message.delete().catch(() => {
                  setTimeout(()=>{
                    try{message.delete().catch((e) => {console.log(e)});}catch(e){ console.log(e)}}, 5000)});}catch(e){setTimeout(()=>{try{message.delete().catch((e) => {console.log(e)});}catch(e){ console.log(e)}}, 5000)}}, 5000)
        else 
            {
              try{message.delete().catch(() => {setTimeout(()=>{try{message.delete().catch(() => {});}catch(e){ }}, 5000)});}catch(e){setTimeout(()=>{try{message.delete().catch(() => {});}catch(e){ }}, 5000)}
            }
        if (message.author.bot) return; // if the message  author is a bot, return aka ignore the inputs
        var prefix = client.settings.get(message.guild.id, "prefix")
        //get the prefix regex system
        const prefixRegex = new RegExp(`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`); //the prefix can be a Mention of the Bot / The defined Prefix of the Bot
        var args;
        var cmd;
        if (prefixRegex.test(message.content)) {
            //if there is a attached prefix try executing a cmd!
            const [, matchedPrefix] = message.content.match(prefixRegex); //now define the right prefix either ping or not ping
            args = message.content.slice(matchedPrefix.length).trim().split(/ +/); //create the arguments with sliceing of of the rightprefix length
            cmd = args.shift().toLowerCase(); //creating the cmd argument by shifting the args by 1
            if (cmd || cmd.length === 0) return// message.reply("<a:No:1156196552373702656> **Please use a Command Somewhere else!**").then(msg=>{setTimeout(()=>{try{msg.delete().catch(() => {});}catch(e){ }}, 3000)})
        
            var command = client.commands.get(cmd); //get the command from the collection
            if (!command) command = client.commands.get(client.aliases.get(cmd)); //if the command does not exist, try to get it by his alias
            if (command) //if the command is now valid
            {
                return// message.reply("<a:No:1156196552373702656> **Please use a Command Somewhere else!**").then(msg=>{setTimeout(()=>{try{msg.delete().catch(() => {});}catch(e){ }}, 3000)})
            }
        }
        //getting the Voice Channel Data of the Message Member
        const {
          channel
        } = message.member.voice;
        //if not in a Voice Channel return!
        if (!channel) return message.reply("<a:No:1156196552373702656> **Please join a Voice Channel first!**").then(msg=>{setTimeout(()=>{try{msg.delete().catch(() => {});}catch(e){ }}, 5000)})
        //get the lavalink erela.js player information
        const player = client.manager.players.get(message.guild.id);
        //if there is a player and the user is not in the same channel as the Bot return information message
        if (player && channel.id !== player.voiceChannel) return message.reply(`<a:No:1156196552373702656> **Please join __my__ Voice Channel first! <#${player.voiceChannel}>**`).then(msg=>{setTimeout(()=>{try{msg.delete().catch(() => {});}catch(e){ }}, 3000)})

        
        else {
            return playermanager(client, message, message.content.trim().split(/ +/), "request:song");
        }
    })


}
function generateQueueEmbed(client, guildId, leave){
    let guild = client.guilds.cache.get(guildId)
    if(!guild) return;
    let es = client.settings.get(guild.id, "embed")
    let ls = client.settings.get(guild.id, "language")
    var embeds = [
      new MessageEmbed()
        .setColor(es.color)
        .setTitle(`<:music_queue:1157589838296514573> Queue of __${guild.name}__`)
        .setDescription(`**Currently there are __0 Songs__ in the Queue**`)
        .setThumbnail(guild.iconURL({dynamic: true})),
      new MessageEmbed()
        .setColor(es.color)
        .setFooter(client.getFooter(es))
        .setImage(guild.banner ? guild.bannerURL({size: 4096}) : `${config.bannermusic}`)
        .setTitle(`Start Listening to Music, by connecting to a Voice Channel and sending either the **SONG LINK** or **SONG NAME** in this Channel!`)
        .setDescription(`> *I support <:YouTube:1156128039646801991> Youtube, <:Spotify:1156129087270699038> Spotify, <:soundcloud:1157595611613376543> Soundcloud and direct MP3 Links!*`)
    ]
    const player = client.manager.players.get(guild.id);
    if(!leave && player && player.queue && player.queue.current){
        embeds[1].setImage(`https://img.youtube.com/vi/${player.queue.current.identifier}/mqdefault.jpg`)
            .setFooter(client.getFooter(`Requested by: ${player.queue.current.requester.tag}`, player.queue.current.requester.displayAvatarURL({dynamic: true})))
            .addField(`${emoji?.msg.time} Duration: `, `\`${format(player.queue.current.duration).split(" | ")[0]}\` | \`${format(player.queue.current.duration).split(" | ")[1]}\``, true)
            .addField(`${emoji?.msg.song_by} Song By: `, `\`${player.queue.current.author}\``, true)
            .addField(`${emoji?.msg.repeat_mode} Queue length: `, `\`${player.queue.length} Songs\``, true)
            .setAuthor(`${player.queue.current.title}`, "https://media.discordapp.net/attachments/1122899251924566147/1158070378585919488/save.gif", player.queue.current.uri)
        delete embeds[1].description;
        delete embeds[1].title;
        //get the right tracks of the current tracks
        const tracks = player.queue;
        var maxTracks = 10; //tracks / Queue Page
        //get an array of quelist where 10 tracks is one index in the array
        var songs = tracks.slice(0, maxTracks);
        embeds[0] = new MessageEmbed()
        .setTitle(`<:music_queue:1157589838296514573> Queue of __${guild.name}__  -  [ ${player.queue.length} Tracks ]`)
        .setColor(es.color)
        .setDescription(String(songs.map((track, index) => `**\` ${++index}. \` ${track.uri ? `[${track.title.substr(0, 60).replace(/\[/igu, "\\[").replace(/\]/igu, "\\]")}](${track.uri})` : track.title}** - \`${track.isStream ? `LIVE STREAM` : format(track.duration).split(` | `)[0]}\`\n> *Requested by: __${track.requester.tag}__*`).join(`\n`)).substr(0, 2048));
        if(player.queue.length > 10)
          embeds[0].addField(`**\` N. \` *${player.queue.length > maxTracks ? player.queue.length - maxTracks : player.queue.length} other Tracks ...***`, `\u200b`)
        embeds[0].addField(`**\` 0. \` __CURRENT TRACK__**`, `**${player.queue.current.uri ? `[${player.queue.current.title.substr(0, 60).replace(/\[/igu, "\\[").replace(/\]/igu, "\\]")}](${player.queue.current.uri})`:player.queue.current.title}** - \`${player.queue.current.isStream ? `LIVE STREAM` : format(player.queue.current.duration).split(` | `)[0]}\`\n> *Requested by: __${player.queue.current.requester.tag}__*`)
            
    }
    var joinbutton = new MessageButton().setStyle('PRIMARY').setCustomId('Join').setEmoji(`<:Join:1158073614231408650>`).setLabel(`Join`).setDisabled(false);
    var leavebutton = new MessageButton().setStyle('PRIMARY').setCustomId('Leave').setEmoji(`<:leave:1158073519989604504>`).setLabel(`Leave`).setDisabled();
    var stopbutton = new MessageButton().setStyle('PRIMARY').setCustomId('Stop').setEmoji(`<:music_stop:1157587784211628084>`).setLabel(`Stop`).setDisabled()
    var skipbutton = new MessageButton().setStyle('PRIMARY').setCustomId('Skip').setEmoji(`<:music_next:1157591921594736711>`).setLabel(`Skip`).setDisabled();
    var shufflebutton = new MessageButton().setStyle('PRIMARY').setCustomId('Shuffle').setEmoji('<:shuffle:1157588964308418560>').setLabel(`Shuffle`).setDisabled();
    var pausebutton = new MessageButton().setStyle('PRIMARY').setCustomId('Pause').setEmoji('<:music_pause:1157590387423186985>').setLabel(`Pause`).setDisabled();
    var autoplaybutton = new MessageButton().setStyle('PRIMARY').setCustomId('Autoplay').setEmoji('<:autoplay:1157590582068269067>').setLabel(`Autoplay`).setDisabled();
    var songbutton = new MessageButton().setStyle('PRIMARY').setCustomId('Song').setEmoji(`
<:add_song:1158077321757065237>`).setLabel(`Song`).setDisabled();
    var queuebutton = new MessageButton().setStyle('PRIMARY').setCustomId('Queue').setEmoji(`<:music_queue:1157589838296514573>`).setLabel(`Queue`).setDisabled();
    var forwardbutton = new MessageButton().setStyle('PRIMARY').setCustomId('Forward').setEmoji('<:forward10:1157593613123977306>').setLabel(`+10 Sec`).setDisabled();
    var rewindbutton = new MessageButton().setStyle('PRIMARY').setCustomId('Rewind').setEmoji('<:rewind10:1157593717348249682>').setLabel(`-10 Sec`).setDisabled();
    var lyricsbutton = new MessageButton().setStyle('PRIMARY').setCustomId('Lyrics').setEmoji('<:lyrics:1158078065243586610>').setLabel(`Lyrics`).setDisabled();
    if(!leave && player && player.queue && player.queue.current){
        skipbutton = skipbutton.setDisabled(false);
        shufflebutton = shufflebutton.setDisabled(false);
        stopbutton = stopbutton.setDisabled(false);
        songbutton = songbutton.setDisabled(false);
        queuebutton = queuebutton.setDisabled(false);
        forwardbutton = forwardbutton.setDisabled(false);
        rewindbutton = rewindbutton.setDisabled(false);
        autoplaybutton = autoplaybutton.setDisabled(false)
        pausebutton = pausebutton.setDisabled(false)
        if (player.get("autoplay")) {
            autoplaybutton = autoplaybutton.setStyle('SECONDARY')
        }
        if (!player.playing) {
            pausebutton = pausebutton.setStyle('SUCCESS').setEmoji('▶️').setLabel(`Resume`)
        }
        if (!player.queueRepeat && !player.trackRepeat) {
            songbutton = songbutton.setStyle('SUCCESS')
            queuebutton = queuebutton.setStyle('SUCCESS')
        }
        if (player.trackRepeat) {
            songbutton = songbutton.setStyle('SECONDARY')
            queuebutton = queuebutton.setStyle('SUCCESS')
        }
        if (player.queueRepeat) {
            songbutton = songbutton.setStyle('SUCCESS')
            queuebutton = queuebutton.setStyle('SECONDARY')
        }
    }
    if(player){
        joinbutton = joinbutton.setDisabled()
        leavebutton = leavebutton.setDisabled(false);
    }
    if(leave){
        joinbutton = joinbutton.setDisabled(false)
        leavebutton = leavebutton.setDisabled(true);
    }
    //now we add the components!
    var components = [
      new MessageActionRow().addComponents([
        joinbutton,
        leavebutton,
      ]),
      new MessageActionRow().addComponents([
        skipbutton,
        stopbutton,
        pausebutton,
        autoplaybutton,
        shufflebutton,
      ]),
      new MessageActionRow().addComponents([
        songbutton,
        queuebutton,
        forwardbutton,
        rewindbutton,
        lyricsbutton,
      ]),
    ]
    return {
      embeds, 
      components
    }
}
module.exports.generateQueueEmbed = generateQueueEmbed;