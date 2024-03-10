const { MessageEmbed } = require("discord.js");
module.exports = function (client, options) {

  client.on("guildMemberUpdate", async (oM, nM) => {
    
    client.settings.ensure(nM.guild.id, {
      boost: {
        enabled: false,
        message: "",
        log: false,
      }
    })
    if(!client.settings.has(nM.guild.id)) return;
    if(!client.settings.has(nM.guild.id, "boost")) return;

    let settings = client.settings.get(nM.guild.id, "boost");
    if(settings && settings.enabled) {
      //if he/she starts boosting      
      if(!oM.premiumSince && nM.premiumSince) {
        //send the MEMBER a DM
        nM.send(settings.message.substr(0, 2000)).catch(() => {});
      }
    }



    if(settings && settings.log) {
      let boostLogChannel = nM.guild.channels.cache.get(settings.log);
      if(!boostLogChannel) boostLogChannel = await nM.guild.channels.fetch(settings.log).catch(()=>{}) || false;
      if(!boostLogChannel) return;
      
      let stopBoost = new MessageEmbed()
          .setFooter(client.getFooter("ID: " + nM.user.id))
          .setTimestamp()
          .setAuthor(client.getAuthor(nM.user.tag, nM.user.displayAvatarURL({dynamic: true})))
          .setColor("RED")
          .setDescription(`<:Boost_Level:1212064723152015361> ${nM.user} **stopped Boosting us..** <:RoneDo:1213789826462126120>`)
      let startBoost = new MessageEmbed()
          .setFooter(client.getFooter("ID: " + nM.user.id))
          .setTimestamp()
          .setAuthor(client.getAuthor(nM.user.tag, nM.user.displayAvatarURL({dynamic: true})))
          .setColor("GREEN")
          .setDescription(`<a:Boost:1212064415290105856> ${nM.user} **has boosted us!** <a:Celebrate_Left:1204295443836702811>`)
          
      //if he/she starts boosting
      if(!oM.premiumSince && nM.premiumSince) {
        boostLogChannel.send({embeds: [startBoost]}).catch(console.warn);
      }
      //if he/she stops boosting
      if(oM.premiumSince && !nM.premiumSince) {
          boostLogChannel.send({embeds: [stopBoost]}).catch(console.warn)
      }
    }
  });
}
