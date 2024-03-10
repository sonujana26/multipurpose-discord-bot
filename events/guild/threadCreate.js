//The Module
module.exports = async (client, thread) => {
    try{
        if(thread.joinable && !thread.joined){
            await thread.join();
        }
    }catch (e){
        console.log(String(e).grey)
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
