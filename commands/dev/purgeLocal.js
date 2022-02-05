'use strict';

const { SlashCommandBuilder } = require('@discordjs/builders');
const { CommandInteraction } = require('discord.js');

const purgeLocal = {
  data: new SlashCommandBuilder()
    .setName('purgelocal')
    .setDescription('Purges local commands')
    .setDefaultPermission(false),
  /**
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    await interaction.guild.commands.set([]);
    await interaction.reply({ content: '✅', ephemeral: true });
  }
};

module.exports = purgeLocal;
