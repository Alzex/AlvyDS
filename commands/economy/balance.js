'use strict';

const { SlashCommandBuilder } = require('@discordjs/builders');
const guild = require('../../models/guild');
const { MessageEmbed } = require('discord.js');

const balance = {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Проверка доступного баланса'),

  async execute(interaction) {
    const gui = await guild.findById(interaction.guild.id);
    const user = gui.users.find((u) => u._id === interaction.user.id);
    if (typeof user.coins === 'undefined') {
      user.coins = 0;
      gui.users[gui.users.indexOf(user)] = user;
      await gui.save();
    }
    const embed = new MessageEmbed()
      .setTitle(interaction.user.username)
      .setThumbnail(interaction.user.avatarURL())
      .setDescription(`**Баланс:** ${user.coins}$`);
    await interaction.reply({ embeds: [embed] });
  }
};

module.exports = balance;
