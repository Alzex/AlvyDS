'use strict';

const { SlashCommandBuilder } = require('@discordjs/builders');

const ping = {
  data: new SlashCommandBuilder().setName('ping').setDescription('test'),
  async execute(interaction) {
    await interaction.reply('pong');
  },
};

module.exports = ping;
