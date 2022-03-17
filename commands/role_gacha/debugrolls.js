'use strict';

const { SlashCommandBuilder, SlashCommandNumberOption } = require('@discordjs/builders');
const randomTier = require('../../utils/randomTier');

const debugrolls = {
  data: new SlashCommandBuilder()
    .setName('simulate_rolls')
    .setDescription('Симмулирует вызов ролей для проверки работы генератора')
    .addNumberOption(new SlashCommandNumberOption()
      .setName('amount')
      .setDescription('Amount to roll')
      .setMinValue(1)
      .setMaxValue(35)
      .setRequired(true)),
  async execute(interaction) {
    const amount = interaction.options.getNumber('amount');
    let text = '';
    for (let i = 0; i < amount; i++) {
      const tier = randomTier();
      text += '\n' + 
      `${i + 1}) **${tier.name}** Color: ${tier.color}` +
      ` Probability: ${tier.probability}`;
    }
    await interaction.reply({ content: text });
  }
};

module.exports = debugrolls;
