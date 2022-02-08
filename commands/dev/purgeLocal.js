'use strict';

const {
  SlashCommandBuilder,
  SlashCommandStringOption } = require('@discordjs/builders');
const { CommandInteraction } = require('discord.js');

const purgeLocal = {
  data: new SlashCommandBuilder()
    .setName('purgelocal')
    .setDescription('Purges local commands')
    .setDefaultPermission(false)
    .addStringOption(new SlashCommandStringOption()
      .setName('id')
      .setDescription('Local commmand id to purge')
    ),
  /**
   * @param {CommandInteraction} interaction
   */
  async execute(interaction) {
    const commandId = interaction.options.getString('id');
    if (commandId !== null) {
      await interaction.guild.commands.delete(commandId);
    } else {
      await interaction.guild.commands.set([]);
    }
    await interaction.reply({ content: '✅', ephemeral: true });
  }
};

module.exports = purgeLocal;
