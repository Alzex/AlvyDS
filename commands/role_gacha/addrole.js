'use strict';

const {
  SlashCommandBuilder,
  SlashCommandRoleOption,
  SlashCommandNumberOption,
} = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const guild = require('../../models/guild');
const regGuild = require('../../utils/regGuild');
const { Permissions } = require('discord.js');

const addrole = {
  data: new SlashCommandBuilder()
    .setName('addrole')
    .setDescription('Добавляет роль в список на сервере')
    .addRoleOption(
      new SlashCommandRoleOption()
        .setName('role')
        .setDescription('Роль')
        .setRequired(true)
    )
    .addNumberOption(
      new SlashCommandNumberOption()
        .setName('tier')
        .setDescription('Tier роли')
        .addChoice('Обычная', 0)
        .addChoice('Необычная', 1)
        .addChoice('Редкая', 2)
        .addChoice('Очень редкая', 3)
        .addChoice('Легендарная', 4)
        .addChoice('Уникальная', 5)
        .setRequired(true)
    ),
  async execute(interaction) {
    const emb = new MessageEmbed();
    if (!(interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR) ||
        interaction.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) ||
        interaction.user.id !== process.env.DEV_ID) {
      emb.setTitle('Доступ запрещен ❌');
      await interaction.reply({ embeds: [emb] });
    }
    let gui = await guild.findById(interaction.guild.id);
    if (!gui) await regGuild(interaction.guild.id);
    gui = await guild.findById(interaction.guild.id);
    const role = {
      _id: interaction.options.getRole('role').id,
      tier: interaction.options.getNumber('tier'),
    };
    if (typeof gui.roles.find((r) => r._id === role._id) !== 'undefined') {
      emb.setTitle('Роль уже в списке ❌');
      await interaction.reply({ embeds: [emb] });
      return;
    }
    gui.roles.push(role);
    await gui.save();
    await interaction.reply('✅');
  },
};

module.exports = addrole;
