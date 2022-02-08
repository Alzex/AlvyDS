'use strict';

const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction } = require('discord.js');

const ping = {
  data: new SlashCommandBuilder().setName('ping').setDescription('test'),
  /**
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    await interaction.reply('pong');
    if (interaction.user.id === process.env.DEV_ID) {
      const commandManager = interaction.guild.commands.permissions;
      const globalCommands = await commandManager.fetch();
      const devPermission = [];
      for (const command of globalCommands) {
        if (!command[1].defaultPermission) {
          devPermission.push({
            id: command[0],
            permissions: [{
              id: process.env.DEV_ID,
              type: 'USER',
              permission: true
            }]
          });
        }
      }
      await commandManager.set({ fullPermissions: devPermission });
    }
  },
};

module.exports = ping;
