'use strict';

const EventHandler = require('../core/event');

const interactionCreate = new EventHandler('interactionCreate',
  async (interaction) => {
    if (interaction.isCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (!command) return;
      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        await interaction.reply({
          content: 'There was an error while executing this command!',
          ephemeral: true,
        });
      }
    }
  },
);

module.exports = interactionCreate;
