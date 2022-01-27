'use strict';

const {
  SlashCommandBuilder,
  SlashCommandStringOption,
} = require('@discordjs/builders');
const { answers } = require('../../config/8ball.json');

const eiBall = {
  data: new SlashCommandBuilder()
    .setName('8ball')
    .setDescription('Шар предсказаний')
    .addStringOption(
      new SlashCommandStringOption()
        .setName('question')
        .setDescription('Вопрос')
        .setRequired(true)
    ),
  async execute(interaction) {
    await interaction.reply(
      answers[Math.floor(Math.random() * answers.length)]
    );
  },
};

module.exports = eiBall;
