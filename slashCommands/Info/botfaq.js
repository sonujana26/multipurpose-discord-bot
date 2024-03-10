const Discord = require("discord.js");
const config = require(`${process.cwd()}/botconfig/config.json`);
var ee = require(`${process.cwd()}/botconfig/embed.json`);
const emoji = require(`${process.cwd()}/botconfig/emojis.json`);
const { duration, handlemsg } = require(`${process.cwd()}/handlers/functions`)
const { MessageActionRow, MessageSelectMenu } = require("discord.js")

module.exports = {
    name: "botfaq",
    description: "Frequently Asked Questions, about me!",
    run: async (client, interaction, cmduser, es, ls, prefix, player, message) => {
        try {
            // Check if the interaction object exists and is valid
            if (!interaction || !interaction.isSelectMenu()) return;

            const milratodc = client.guilds.cache.get("1195178425778982973");
            if (!milratodc) return;

            const milratomembers = await milratodc.members.fetch();
            let partnercount = milratomembers.filter(m => m.roles.cache.has("1195178425799938136")).size;

            let menuoptions = [
                // Define your menu options here...
            ];

            // Define the selection
            let Selection = new MessageActionRow()
                .addComponents(
                    new MessageSelectMenu()
                        .setCustomId("Botfaq-SlashCmd")
                        .setPlaceholder(client.la[ls].cmds.info.botfaq.placeholder)
                        .addOptions(menuoptions.map(o => ({
                            label: o.value.substring(0, 25),
                            value: o.value.substring(0, 25),
                            description: o.description.substring(0, 50),
                            emoji: o.emoji
                        })))
                );

            // Define the embed
            let MenuEmbed = new MessageEmbed()
                .setColor(es.color)
                .setAuthor(client.la[ls].cmds.info.botfaq.menuembed.title, client.user.displayAvatarURL(), "https://discord.gg/milrato")
                .setDescription(client.la[ls].cmds.info.botfaq.menuembed.description);

            // Send the menu message
            await interaction.reply({ embeds: [MenuEmbed], components: [Selection], ephemeral: true });

            // Function to handle the menu selection
            function menuselection(interaction) {
                let menuoptiondata = menuoptions.find(v => v.value.substring(0, 25) == interaction.values[0]);
                interaction.reply({ embeds: [new MessageEmbed().setColor(es.color).setAuthor(client.la[ls].cmds.info.botfaq.menuembed.title, client.user.displayAvatarURL(), "https://discord.gg/milrato").setDescription(menuoptiondata.replymsg)], ephemeral: true });
            }

            // Event listener for interactionCreate
            client.on('interactionCreate', (interaction) => {
                if (interaction.isSelectMenu() && interaction.customId === "Botfaq-SlashCmd" && interaction.applicationId == client.user.id) {
                    menuselection(interaction);
                }
            });
        } catch (e) {
            console.log(String(e.stack).grey.bgRed);
        }
    },
};      