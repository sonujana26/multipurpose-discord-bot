//Here the command starts
const config = require(`${process.cwd()}/botconfig/config.json`)
var ee = require(`${process.cwd()}/botconfig/embed.json`)
module.exports = {
	//definition
	name: "voiceleaderboard", //the name of the command 
	category: "📈 Ranking", //the category this will be listed at, for the help cmd
	aliases: ["voicelb", "voicetop"], //every parameter can be an alias
	cooldown: 4, //this will set it to a 4 second cooldown
	usage: "voiceleaderboard", //this is for the help command for EACH cmd
  	description: "Shows the Top 10 Voice-Leaderboard", //the description of the command
	  type: "info",
	//running the command with the parameters: client, message, args, user, text, prefix
  run: async (client, message, args, cmduser, text, prefix) => {
    

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