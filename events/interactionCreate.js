'use strict';

const EventHandler = require('../core/event');
const { MessageEmbed, DiscordAPIError } = require('discord.js');

const interactionCreate = new EventHandler('interactionCreate',
  async (interaction) => {
    if (interaction.isCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) return;
      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        const emb = new MessageEmbed()
          .setTitle('System Bug Report')
          .setDescription(error.stack)
          .addField('Error:', error.toString());
        if (error instanceof DiscordAPIError) {
          emb.addField('Method:', error.method)
            .addField('Path:', error.path)
            .addField('Code:', error.code.toString())
            .addField('http status:', error.httpStatus.toString());
        }
        await interaction.reply({
          content: 'Упс... Что-то пошло не так...\nРазработчик уже оповещен :)',
          ephemeral: true,
        });
        const dev = await interaction.client.users.fetch(process.env.DEV_ID);
        const devChat = await dev.createDM();
        await devChat.send({ embeds: [emb] });
      }
    }
  },
);

module.exports = interactionCreate;
