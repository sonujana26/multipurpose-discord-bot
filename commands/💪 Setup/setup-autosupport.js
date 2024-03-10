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
const {
  MessageButton,
  MessageActionRow,
  MessageSelectMenu
} = require('discord.js')
module.exports = {
  name: "setup-autosupport",
  category: "💪 Setup",
  aliases: ["setupautosupport", "autosupport-setup", "autosupportsetup", "autosupportsystem"],
  cooldown: 5,
  usage: "setup-autosupport --> Follow Steps",
  description: "Manage up to 25 different Auto-Support Messages in a DISCORD-MENU",
  memberpermissions: ["ADMINISTRATOR"],
  type: "system",
  run: async (client, message, args, cmduser, text, prefix) => {

    let es = client.settings.get(message.guild.id, "embed");
    let ls = client.settings.get(message.guild.id, "language")
    try {
      let theDB = client.autosupport1;
      
      let NumberEmojiIds = getNumberEmojis().map(emoji => emoji?.replace(">", "").split(":")[2])
      let NumberEmojis = getNumberEmojis().map(emoji => emoji?.replace(">", "").split(":")[2])
      first_layer()
      async function first_layer() {
        let menuoptions = [{
            value: "1. Auto Support",
            description: `Manage the 1. Auto Support System`,
            emoji: "1167636950925180960"
          },
          {
            value: "2. Auto Support",
            description: `Manage the 2. Auto Support System`,
            emoji: "1167637014213054574"
          },
          {
            value: "3. Auto Support",
            description: `Manage the 3. Auto Support System`,
            emoji: "1167637014213054574"
          },
        ]
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection')
          .setMaxValues(1)
          .setMinValues(1)
          .setPlaceholder('Click me to setup the Menu-Apply System!')
          .addOptions(
            menuoptions.map(option => {
              let Obj = {
                label: option.label ? option.label.substr(0, 50) : option.value.substr(0, 50),
                value: option.value.substr(0, 50),
                description: option.description.substr(0, 50),
              }
              if (option.emoji) Obj.emoji = option.emoji;
              return Obj;
            }))
        //define the embed
        let MenuEmbed = new Discord.MessageEmbed()
          .setColor(es.color)
          .setAuthor('Auto Support Setup', 'https://cdn3.emoji.gg/emojis/9268-support-badge.png')
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))
          
        //send the menu msg
        let menumsg = await message.reply({
          embeds: [MenuEmbed],
          components: [new MessageActionRow().addComponents(Selection), new MessageActionRow().addComponents(new MessageButton().setStyle("LINK").setURL("https://youtu.be/QGESDc31d4U").setLabel("Tutorial Video").setEmoji("840260133686870036"))]
        })
        //Create the collector
        const collector = menumsg.createMessageComponentCollector({
          filter: i => i?.isSelectMenu() && i?.message.author.id == client.user.id && i?.user,
          time: 90000, errors: ["time"]
        })
        //Menu Collections
        collector.on('collect', menu => {
          if (menu?.user.id === cmduser.id) {
            collector.stop();
            let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0])
            if (menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
            menu?.deferUpdate();
            let SetupNumber = menu?.values[0].split(".")[0];
            theDB = client[`autosupport${SetupNumber}`]; //change to the right database
            second_layer()
          } else menu?.reply({
            content: `<:cx_cross:1198077504599117834> You are not allowed to do that! Only: <@${cmduser.id}>`,
            ephemeral: true
          });
        });
        //Once the Collections ended edit the menu message
        collector.on('end', collected => {
          menumsg.edit({
            embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)],
            components: [],
            content: `<:cx_tick:1198077126939779102> **Selected: \`${collected && collected.first() && collected.first().values ? collected.first().values[0] : "Nothing"}\`**`
          })
        });
      }
      async function second_layer() {
        //setup-autosupport
        theDB.ensure(message.guild.id, {
          messageId: "",
          channelId: "",
          data: [
            /*
              {
                value: "",
                emoji: "",
                description: "",
                sendEmbed: true,
                replyMsg: "{user} Welcome to the Support!"
              }
            */
          ]
        });
        let menuoptions = [{
            value: "Send the Config	Message",
            description: `(Re) Send the auto-responding Support Message (with MENU)`,
            emoji: "1205442007724466226"
          },
          {
            value: "Add AutoSup Option",
            description: `Add up to 25 different auto-responding Support Options`,
            emoji: "1205442254416642078"
          },
          {
            value: "Edit AutoSup Option",
            description: `Edit one of the auto-responding Support Options`,
            emoji: "1205381286257106984"
          },
          {
            value: "Remove AutoSup Option",
            description: `Remove auto-responding Support Options`,
            emoji: "1205450302589902848"
          }
        ]
        //define the selection
        let Selection = new MessageSelectMenu()
          .setCustomId('MenuSelection')
          .setMaxValues(1)
          .setMinValues(1)
          .setPlaceholder('Click me to setup the Auto-Support System!')
          .addOptions(
            menuoptions.map(option => {
              let Obj = {
                label: option.label ? option.label.substr(0, 50) : option.value.substr(0, 50),
                value: option.value.substr(0, 50),
                description: option.description.substr(0, 50),
              }
              if (option.emoji) Obj.emoji = option.emoji;
              return Obj;
            }))
        //define the embed
        let MenuEmbed = new Discord.MessageEmbed()
          .setColor(es.color)
          .setAuthor('Auto Support Setup', 'https://cdn3.emoji.gg/emojis/9268-support-badge.png')
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable2"]))
        //send the menu msg
        let menumsg = await message.reply({
          embeds: [MenuEmbed],
          components: [new MessageActionRow().addComponents(Selection)]
        })
        //Create the collector
        const collector = menumsg.createMessageComponentCollector({
          filter: i => i?.isSelectMenu() && i?.message.author.id == client.user.id && i?.user,
          time: 90000, errors: ["time"]
        })
        //Menu Collections
        collector.on('collect', menu => {
          if (menu?.user.id === cmduser.id) {
            collector.stop();
            let menuoptiondata = menuoptions.find(v => v.value == menu?.values[0])
            if (menu?.values[0] == "Cancel") return menu?.reply(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable3"]))
            menu?.deferUpdate();
            handle_the_picks(menu?.values[0], menuoptiondata)
          } else menu?.reply({
            content: `<:cx_cross:1198077504599117834> You are not allowed to do that! Only: <@${cmduser.id}>`,
            ephemeral: true
          });
        });
        //Once the Collections ended edit the menu message
        collector.on('end', collected => {
          menumsg.edit({
            embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)],
            components: [],
            content: `<:cx_tick:1198077126939779102> **Selected: \`${collected ? collected.first().values[0] : "Nothing"}\`**`
          })
        });
      }
      async function handle_the_picks(optionhandletype, menuoptiondata) {
        switch (optionhandletype) {
          case "Send the Config	Message": {
            let data = theDB.get(message.guild.id, "data");
            let settings = theDB.get(message.guild.id);
            if (!data || data.length < 1) {
              return message.reply("<:cx_cross:1198077504599117834> **You need to add at least 1 Auto-Support-Option**")
            }
            let tempmsg = await message.reply({
              embeds: [
                new MessageEmbed()
                .setColor(es.color)
                .setTitle("What should be the Text to display in the Embed?")
                .setDescription(`For Example:\n> \`\`\`To get general Help for our Server and our Topics, make sure to select the right option!\`\`\``)
              ]
            });

            let collected = await tempmsg.channel.awaitMessages({
              filter: (m) => m.author.id == cmduser.id,
              max: 1,
              time: 90000, errors: ["time"]
            });
            if (collected && collected.first().content) {
              let tempmsg = await message.reply({
                embeds: [
                  new MessageEmbed()
                  .setColor(es.color)
                  .setTitle("In where should I send the Auto-Support Message?")
                  .setDescription(`Please Ping the Channel now!\n> Just type: \`#channel\`${settings.channelId && message.guild.channels.cache.get(settings.channelId) ? `| Before it was: <#${settings.channelId}>` : settings.channelId ? `| Before it was: ${settings.channelId} (Channel got deleted)` : ""}\n\nYou can edit the Title etc. afterwards by using the \`${prefix}editembed\` Command`)
                ]
              });

              let collected2 = await tempmsg.channel.awaitMessages({
                filter: (m) => m.author.id == cmduser.id,
                max: 1,
                time: 90000, errors: ["time"]
              });
              if (collected2 && collected2.first().mentions.channels.size > 0) {
                let data = theDB.get(message.guild.id, "data");
                let channel = collected2.first().mentions.channels.first();
                let msgContent = collected.first().content;
                let embed = new MessageEmbed()
                  .setColor(es.color)
                  .setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
                  .setFooter(client.getFooter(es))
                  .setDescription(msgContent)
                  .setTitle(":question: Auto Support")
                //define the selection
                let Selection = new MessageSelectMenu()
                  .setCustomId('MenuSelection')
                  .setMaxValues(1)
                  .setMinValues(1)
                  .setPlaceholder('Click me to Access the Auto-Support System!')
                  .addOptions(
                    data.map((option, index) => {
                      let Obj = {
                        label: option.value.substr(0, 50),
                        value: option.value.substr(0, 50),
                        description: option.description.substr(0, 50),
                        emoji: isEmoji(option.emoji) ? option.emoji : NumberEmojiIds[index + 1]
                      }
                      return Obj;
                    }))
                channel.send({
                  embeds: [embed],
                  components: [new MessageActionRow().addComponents([Selection])]
                }).catch(() => {
                  let Selection = new MessageSelectMenu()
                    .setCustomId('MenuSelection')
                    .setMaxValues(1)
                    .setMinValues(1)
                    .setPlaceholder('Click me to Access the Auto-Support System!')
                    .addOptions(
                      data.map((option, index) => {
                        let Obj = {
                          label: option.value.substr(0, 50),
                          value: option.value.substr(0, 50),
                          description: option.description.substr(0, 50),
                          emoji: NumberEmojiIds[index + 1]
                        }
                        return Obj;
                      }))
                    channel.send({
                      embeds: [embed],
                      components: [new MessageActionRow().addComponents([Selection])]
                    }).catch(() => {}).then(msg => {
                      theDB.set(message.guild.id, msg.id, "messageId");
                      theDB.set(message.guild.id, channel.id, "channelId");
                      message.reply(`Successfully Setupped the Auto-Support-System in <#${channel.id}>`)
                    });
                }).then(msg => {
                  theDB.set(message.guild.id, msg.id, "messageId");
                  theDB.set(message.guild.id, channel.id, "channelId");
                  message.reply(`Successfully Setupped the Auto-Support-System in <#${channel.id}>`)
                });
              } else {
                return message.reply("<:cx_cross:1198077504599117834> **You did not ping a valid Channel!**")
              }
            } else {
              return message.reply("<:cx_cross:1198077504599117834> **You did not enter a Valid Message in Time! CANCELLED!**")
            }
          }
          break;
          case "Add AutoSup Option": {
            let data = theDB.get(message.guild.id, "data");
            if (data.length >= 25) {
              return message.reply("<:cx_cross:1198077504599117834> **You reached the limit of 25 different Options!** Remove another Option first!")
            }
            //ask for value and description
            let tempmsg = await message.reply({
              embeds: [
                new MessageEmbed()
                .setColor(es.color)
                .setTitle("What should be the VALUE and DESCRIPTION of the Menu-Option?")
                .setDescription(`**Usage:** \`VALUE++DESCRIPTION\`\n> **Note:** The maximum length of the VALUE is: \`25 Letters\`\n> **Note:** The maximum length of the DESCRIPTION is: \`50 Letters\`\n\nFor Example:\n> \`\`\`Where to get Help++To Get Help visit #ticket-support!\`\`\``)
              ]
            });
            let collected = await tempmsg.channel.awaitMessages({
              filter: (m) => m.author.id == cmduser.id,
              max: 1,
              time: 90000, errors: ["time"]
            });
            if (collected && collected.first().content) {
              if (!collected.first().content.includes("++")) return message.reply("<:cx_cross:1198077504599117834> **Invalid Usage! Please mind the Usage and check the Example**")
              let value = collected.first().content.split("++")[0].trim().substr(0, 25);
              let index2 = data.findIndex(v => v.value == value);
              if(index2 >= 0 && index != index2) {
                  return message.reply("<:cx_cross:1198077504599117834> **Options can't have the SAME VALUE!** There is already an Option with that Value!");
              }
              let description = collected.first().content.split("++")[1].trim().substr(0, 50);
              let tempmsg = await message.reply({
                embeds: [
                  new MessageEmbed()
                  .setColor(es.color)
                  .setTitle("Should the Response be inside of an Embed?")
                ],
                components: [
                  new MessageActionRow().addComponents([
                    new MessageButton().setStyle("SUCCESS").setLabel("In an Embed").setEmoji("✅").setCustomId("yes"),
                    new MessageButton().setStyle("DANGER").setLabel("Not in an Embed").setEmoji("❌").setCustomId("no"),
                  ])
                ]
              });
              //Create the collector
            const collector = tempmsg.createMessageComponentCollector({
              filter: i => i?.isButton() && i?.message.author.id == client.user.id && i?.user,
              time: 90000, errors: ["time"]
            })
            //button Collections
            collector.on('collect', async button => {
              if (button?.user.id === cmduser.id) {
                collector.stop();
                var sendEmbed = true;
                if(button?.customId != "yes"){
                  sendEmbed = false;
                }
                
                let tempmsg = await message.reply({
                  embeds: [
                    new MessageEmbed()
                    .setColor(es.color)
                    .setTitle("What should be the Reply Message Content when someone Selects an Auto-Support-Option?")
                    .setDescription(`For Example:\n> \`\`\`{user} Make sure to check out #ticket-support Channel to open a Ticket!\`\`\``)
                  ]
                });
                let collected3 = await tempmsg.channel.awaitMessages({
                  filter: (m) => m.author.id == cmduser.id,
                  max: 1,
                  time: 90000, errors: ["time"]
                });
                if (collected3 && collected3.first().content) {
                  let replyMsg = collected3.first().content;
                  
                  var rermbed = new MessageEmbed()
                    .setColor(es.color)
                    .setTitle("What should be the EMOJI to be displayed?")
                    .setDescription(`React to __THIS MESSAGE__ with the Emoji you want!\n> Either click on the default Emoji or add a CUSTOM ONE/Standard`)

                  var emoji;
                  message.reply({embeds: [rermbed]}).then(async msg => {
                    await msg.react(NumberEmojiIds[data.length]).catch(console.warn);
                    msg.awaitReactions({ filter: (reaction, user) => user.id == cmduser.id, 
                      max: 1,
                      time: 180e3
                    }).then(async collected => {
                      await msg.reactions.removeAll().catch(console.warn);
                      if (collected.first().emoji?.id && collected.first().emoji?.id.length > 2) {
                        emoji = collected.first().emoji?.id;
                        if (collected.first().emoji?.animated) emojiMsg = "<" + "a:" + collected.first().emoji?.name + ":" + collected.first().emoji?.id  + ">";
                        else emojiMsg = "<" + ":" + collected.first().emoji?.name + ":" + collected.first().emoji?.id  + ">";
                      } else if (collected.first().emoji?.name) {
                        emoji = collected.first().emoji?.name;
                        emojiMsg = collected.first().emoji?.name;
                      } else {
                        message.reply(":x: **No valid emoji added, using default EMOJI**");
                        emoji = null;
                        emojiMsg = NumberEmojis[data.length];
                      }

                      try {
                        await msg.react(emoji);
                        if(NumberEmojiIds.includes(collected.first().emoji?.id)){
                          emoji = null;
                          emojiMsg = NumberEmojis[data.length];
                        }
                      } catch (e){
                        console.log(e)
                        message.reply(":x: **Could not use the CUSTOM EMOJI you added, as I can't access it / use it as a reaction/emoji for the menu**\nUsing default emoji!");
                        emoji = null;
                        emojiMsg = NumberEmojis[data.length];
                      }
                      finished();
                    }).catch(() => {
                      message.reply(":x: **No valid emoji added, using default EMOJI**");
                      emoji = null;
                      emojiMsg = NumberEmojis[data.length];
                      finished();
                    });
                  })
                  function finished() {
                    theDB.push(message.guild.id, {
                      value,
                      description,
                      sendEmbed,
                      replyMsg,
                      emoji
                    }, "data");
                    message.reply({
                      embeds: [
                        new MessageEmbed()
                        .setColor(es.color)
                        .setTitle("Successfully added the New Data to the List!")
                        .setDescription(`Make sure to re-send the Message, so that it's also updating it!\n> \`${prefix}setup-autosupport\` --> Send Config Message`)
                      ]
                    });
                  }
                  
                } else {
                  return message.reply("<:cx_cross:1198077504599117834> **You did not enter a Valid Message in Time! CANCELLED!**")
                }
              }
            })
            //Once the Collections ended edit the menu message
            collector.on('end', collected => {
              tempmsg.edit({
                embeds: [tempmsg.embeds[0].setDescription(`~~${tempmsg.embeds[0].description}~~`)],
                components: [],
                content: `<:cx_tick:1198077126939779102> **Selected: \`${collected ? collected.customId : "Nothing | CANCELLED"}\`**`
              })
            });
            } else {
              return message.reply("<:cx_cross:1198077504599117834> **You did not enter a Valid Message in Time! CANCELLED!**")
            }
          }
          break;
          case "Edit AutoSup Option": {
            let data = theDB.get(message.guild.id, "data");
            if (!data || data.length < 1) {
              return message.reply("<:cx_cross:1198077504599117834> **There are no Open-Ticket-Options to edit**")
            }
            let embed = new MessageEmbed()
              .setColor(es.color)
              .setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
              .setFooter(client.getFooter(es))
              .setDescription("Just pick the Options you want to edit!")
              .setTitle("Which Option do you want to edit?")
            //define the selection
            let Selection = new MessageSelectMenu()
              .setCustomId('MenuSelection')
              .setMaxValues(1)
              .setMinValues(1)
              .setPlaceholder('Click me to setup the Auto-Support System!')
              .addOptions(
                data.map((option, index) => {
                  let Obj = {
                    label: option.value.substr(0, 50),
                    value: option.value.substr(0, 50),
                    description: option.description.substr(0, 50),
                    emoji: isEmoji(option.emoji) ? option.emoji : NumberEmojiIds[index + 1]
                  }
                  return Obj;
                }))
            //send the menu msg
            let menumsg;
            menumsg = await message.reply({
              embeds: [embed],
              components: [new MessageActionRow().addComponents([Selection])]
            }).catch(async() => {
              let Selection = new MessageSelectMenu()
              .setCustomId('MenuSelection')
              .setMaxValues(1)
              .setMinValues(1)
              .setPlaceholder('Click me to setup the Auto-Support System!')
              .addOptions(
                data.map((option, index) => {
                  let Obj = {
                    label: option.value.substr(0, 50),
                    value: option.value.substr(0, 50),
                    description: option.description.substr(0, 50),
                    emoji: NumberEmojiIds[index + 1]
                  }
                  return Obj;
              }))
              menumsg = await message.reply({
                embeds: [embed],
                components: [new MessageActionRow().addComponents([Selection])]
              })
            })
            //Create the collector
            const collector = menumsg.createMessageComponentCollector({
              filter: i => i?.isSelectMenu() && i?.message.author.id == client.user.id && i?.user,
              time: 90000, errors: ["time"]
            })
            //Menu Collections
            collector.on('collect', async menu => {
              if (menu?.user.id === cmduser.id) {
                collector.stop();
                let index = data.findIndex(v => v.value == menu?.values[0]);

                //ask for value and description
                let tempmsg = await message.reply({
                  embeds: [
                    new MessageEmbed()
                    .setColor(es.color)
                    .setTitle("What should be the VALUE and DESCRIPTION of the Menu-Option?")
                    .setDescription(`**Usage:** \`VALUE++DESCRIPTION\`\n> **Note:** The maximum length of the VALUE is: \`25 Letters\`\n> **Note:** The maximum length of the DESCRIPTION is: \`50 Letters\`\n\nFor Example:\n> \`\`\`Where to get Help++To Get Help visit #ticket-support!\`\`\``)
                  ]
                });
                let collected = await tempmsg.channel.awaitMessages({
                  filter: (m) => m.author.id == cmduser.id,
                  max: 1,
                  time: 90000, errors: ["time"]
                });
                if (collected && collected.first().content) {
                  if (!collected.first().content.includes("++")) return message.reply("<:cx_cross:1198077504599117834> **Invalid Usage! Please mind the Usage and check the Example**")
                  let value = collected.first().content.split("++")[0].trim().substr(0, 25);
                  let index2 = data.findIndex(v => v.value == value);
                  if(index2 >= 0 && index != index2) {
                      return message.reply("<:cx_cross:1198077504599117834> **Options can't have the SAME VALUE!** There is already an Option with that Value!");
                  }
                  let description = collected.first().content.split("++")[1].trim().substr(0, 50);
                  let tempmsg = await message.reply({
                    embeds: [
                      new MessageEmbed()
                      .setColor(es.color)
                      .setTitle("Should the Response be inside of an Embed?")
                    ],
                    components: [
                      new MessageActionRow().addComponents([
                        new MessageButton().setStyle("SUCCESS").setLabel("In an Embed").setEmoji("✅").setCustomId("yes"),
                        new MessageButton().setStyle("DANGER").setLabel("Not in an Embed").setEmoji("❌").setCustomId("no"),
                      ])
                    ]
                  });
                  //Create the collector
                const collector = tempmsg.createMessageComponentCollector({
                  filter: i => i?.isButton() && i?.message.author.id == client.user.id && i?.user,
                  time: 90000, errors: ["time"]
                })
                //button Collections
                collector.on('collect', async button => {
                  if (button?.user.id === cmduser.id) {
                    collector.stop();
                    var sendEmbed = true;
                    if(button?.customId != "yes"){
                      sendEmbed = false;
                    }
                    
                    let tempmsg = await message.reply({
                      embeds: [
                        new MessageEmbed()
                        .setColor(es.color)
                        .setTitle("What should be the Reply Message Content when someone Selects an Auto-Support-Option?")
                        .setDescription(`For Example:\n> \`\`\`{user} Make sure to check out #ticket-support Channel to open a Ticket!\`\`\``)
                      ]
                    });
                    let collected3 = await tempmsg.channel.awaitMessages({
                      filter: (m) => m.author.id == cmduser.id,
                      max: 1,
                      time: 90000, errors: ["time"]
                    });
                    if (collected3 && collected3.first().content) {
                      let replyMsg = collected3.first().content;
                      
                      var rermbed = new MessageEmbed()
                        .setColor(es.color)
                        .setTitle("What should be the EMOJI to be displayed?")
                        .setDescription(`React to __THIS MESSAGE__ with the Emoji you want!\n> Either click on the default Emoji or add a CUSTOM ONE/Standard`)

                      var emoji;
                      message.reply({embeds: [rermbed]}).then(async msg => {
                        await msg.react(NumberEmojiIds[data.length]).catch(console.warn);
                        msg.awaitReactions({ filter: (reaction, user) => user.id == cmduser.id, 
                          max: 1,
                          time: 180e3
                        }).then(async collected => {
                          await msg.reactions.removeAll().catch(console.warn);
                          if (collected.first().emoji?.id && collected.first().emoji?.id.length > 2) {
                            emoji = collected.first().emoji?.id;
                            if (collected.first().emoji?.animated) emojiMsg = "<" + "a:" + collected.first().emoji?.name + ":" + collected.first().emoji?.id  + ">";
                            else emojiMsg = "<" + ":" + collected.first().emoji?.name + ":" + collected.first().emoji?.id  + ">";
                          } else if (collected.first().emoji?.name) {
                            emoji = collected.first().emoji?.name;
                            emojiMsg = collected.first().emoji?.name;
                          } else {
                            message.reply(":x: **No valid emoji added, using default EMOJI**");
                            emoji = null;
                            emojiMsg = NumberEmojis[data.length];
                          }

                          try {
                            await msg.react(emoji);
                            if(NumberEmojiIds.includes(collected.first().emoji?.id)){
                              emoji = null;
                              emojiMsg = NumberEmojis[data.length];
                            }
                          } catch (e){
                            console.log(e)
                            message.reply(":x: **Could not use the CUSTOM EMOJI you added, as I can't access it / use it as a reaction/emoji for the menu**\nUsing default emoji!");
                            emoji = null;
                            emojiMsg = NumberEmojis[data.length];
                          }
                          finished();
                        }).catch(() => {
                          message.reply(":x: **No valid emoji added, using default EMOJI**");
                          emoji = null;
                          emojiMsg = NumberEmojis[data.length];
                          finished();
                        });
                      })
                      function finished() {
                        data[index] = {
                          value,
                          description,
                          sendEmbed,
                          replyMsg,
                          emoji
                        };
                        theDB.set(message.guild.id, data, "data");
                        message.reply(`**Successfully edited:**\n>>> ${menu?.values.map(i => `\`${i}\``).join(", ")}\n\nDon't forget to resend the Auto Support Config-Message!`)
                      }
                      
                    } else {
                      return message.reply("<:cx_cross:1198077504599117834> **You did not enter a Valid Message in Time! CANCELLED!**")
                    }
                  }
                })
                //Once the Collections ended edit the menu message
                collector.on('end', collected => {
                  tempmsg.edit({
                    embeds: [tempmsg.embeds[0].setDescription(`~~${tempmsg.embeds[0].description}~~`)],
                    components: [],
                    content: `<:cx_tick:1198077126939779102> **Selected: \`${collected ? collected.customId : "Nothing | CANCELLED"}\`**`
                  })
                });
                } else {
                  return message.reply("<:cx_cross:1198077504599117834> **You did not enter a Valid Message in Time! CANCELLED!**")
                }
              } else menu?.reply({
                content: `<:cx_cross:1198077504599117834> You are not allowed to do that! Only: <@${cmduser.id}>`,
                ephemeral: true
              });
            });
            //Once the Collections ended edit the menu message
            collector.on('end', collected => {
              menumsg.edit({
                embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)],
                components: [],
                content: `<:cx_tick:1198077126939779102> **Selected: \`${collected ? collected.first().values[0] : "Nothing"}\`**`
              })
            });
          }
          break;
          case "Remove AutoSup Option": {
          let data = theDB.get(message.guild.id, "data");
          if (!data || data.length < 1) {
            return message.reply("<:cx_cross:1198077504599117834> **There are no Auto-Responding-Support-Options to remove**")
          }
          let embed = new MessageEmbed()
            .setColor(es.color)
            .setThumbnail(es.thumb ? es.footericon && (es.footericon.includes("http://") || es.footericon.includes("https://")) ? es.footericon : client.user.displayAvatarURL() : null)
            .setFooter(client.getFooter(es))
            .setDescription("Just pick the Options you want to remove!")
            .setTitle("Which Option Do you want to remove?")
          //define the selection
          let Selection = new MessageSelectMenu()
            .setCustomId('MenuSelection')
            .setMaxValues(data.length)
            .setMinValues(1)
            .setPlaceholder('Click me to setup the Auto-Support System!')
            .addOptions(
              data.map((option, index) => {
                let Obj = {
                  label: option.value.substr(0, 50),
                  value: option.value.substr(0, 50),
                  description: option.description.substr(0, 50),
                  emoji: isEmoji(option.emoji) ? option.emoji : NumberEmojiIds[index + 1]
                }
                return Obj;
              }))
          //send the menu msg
          let menumsg;
            menumsg = await message.reply({
              embeds: [embed],
              components: [new MessageActionRow().addComponents([Selection])]
            }).catch(async() => {
              let Selection = new MessageSelectMenu()
              .setCustomId('MenuSelection')
              .setMaxValues(1)
              .setMinValues(1)
              .setPlaceholder('Click me to setup the Auto-Support System!')
              .addOptions(
                data.map((option, index) => {
                  let Obj = {
                    label: option.value.substr(0, 50),
                    value: option.value.substr(0, 50),
                    description: option.description.substr(0, 50),
                    emoji: NumberEmojiIds[index + 1]
                  }
                  return Obj;
              }))
              menumsg = await message.reply({
                embeds: [embed],
                components: [new MessageActionRow().addComponents([Selection])]
              })
            })
          //Create the collector
          const collector = menumsg.createMessageComponentCollector({
            filter: i => i?.isSelectMenu() && i?.message.author.id == client.user.id && i?.user,
            time: 90000, errors: ["time"]
          })
          //Menu Collections
          collector.on('collect', async menu => {
            if (menu?.user.id === cmduser.id) {
              collector.stop();
              for (const value of menu?.values) {
                let index = data.findIndex(v => v.value == value);
                data.splice(index, 1)
              }
              theDB.set(message.guild.id, data, "data");
              message.reply(`**Successfully removed:**\n>>> ${menu?.values.map(i => `\`${i}\``).join(", ")}\n\nDon't forget to resend the Auto Support Config-Message!`)
            } else menu?.reply({
              content: `<:cx_cross:1198077504599117834> You are not allowed to do that! Only: <@${cmduser.id}>`,
              ephemeral: true
            });
          });
          //Once the Collections ended edit the menu message
          collector.on('end', collected => {
            menumsg.edit({
              embeds: [menumsg.embeds[0].setDescription(`~~${menumsg.embeds[0].description}~~`)],
              components: [],
              content: `<:cx_tick:1198077126939779102> **Selected: \`${collected ? collected.first().values[0] : "Nothing"}\`**`
            })
          });
        }
        break;
        }
      }
    } catch (e) {
      console.log(String(e.stack).grey.bgRed)
      return message.reply({
        embeds: [new MessageEmbed()
          .setColor(es.wrongcolor).setFooter(client.getFooter(es))
          .setTitle(client.la[ls].common.erroroccur)
          .setDescription(eval(client.la[ls]["cmds"]["setup"]["setup-ticket"]["variable39"]))
        ]
      });
    }
    function getNumberEmojis() {
      return [
    "<:NNumber0_:1205390294695149660>",
    "<:one:1167636950925180960>",
    "<:two:1167637014213054574>",
    "<:three3:1167637063349321768>",
    "<:four:1167637099336441997>",
    "<:five:1167637165203804190>",
    "<:six:1167637222657376287>",
    "<:seven:1167637280161284136>",
    "<:eight:1167637331273056324>",
    "<:nine:1167637396398030909>",
    "<:ten:1167637470393942056>",
    "<:eleven:1167637528090791966>",
    "<:twelve:1167637592615964772>",
    "<:thirteen:1167637707778961468>",
    "<:Fourteen:1167637812514926643>",
    "<:zy15FIFTEEN:1167638010850967615>",
    "<:zy16SIXTEEN:1167638184423854120>",
    "<:seventeen:1167638306490691737>",
    "<:eighteen:1167638359473135648>",
    "<:nineteen:1167638507536269403>",
    "<:twenty:1167638573797883974>",
    "<:b3_ayi_21TwentyOne:1167638805327646862>",
    "<:b4_ayi_22TwentyTwo:1167638876194611280>",
    "<:b5_ayi_23TwentyThree:1167638951302012928>",
    "<:b6_ayi_24TwentyFour:1167639047666143282>",
    "<:b7_ayi_25TwentyFive:1167639106642264124>"


  ]

    }
    function isEmoji(emoji) {
      if(!emoji) return false;
      const regexExp = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/gi;
      let unicode = regexExp.test(String(emoji));
      if(unicode) {
        return true 
      } else {
        let dcemoji = client.emojis.cache.has(emoji) || message.guild.emojis.cache.has(emoji);
        if(dcemoji) return true;
        else return false;
      }
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
