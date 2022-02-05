'use strict';

const {
  SlashCommandBuilder,
  SlashCommandRoleOption,
} = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const guild = require('../../models/guild');

const removerole = {
  data: new SlashCommandBuilder()
    .setName('removerole')
    .setDescription('Удаляет роль из списка')
    .addRoleOption(
      new SlashCommandRoleOption()
        .setName('role')
        .setDescription('Роль, что нужно удалить')
        .setRequired(true)
    ),
  async execute(interaction) {
    if (!(interaction.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR) ||
    interaction.member.permissions.has(Permissions.FLAGS.MANAGE_ROLES)) ||
    interaction.user.id === process.env.DEV_ID) {
      const embed = new MessageEmbed()
        .setTitle('Доступ запрещен ❌');
      await interaction.reply({ embeds: [embed] });
    }
    const gui = await guild.findById(interaction.guild.id);
    const roleId = interaction.options.getRole('role');
    for (const role of gui.roles) {
      if (role._id === parseInt(roleId.id)) {
        gui.roles.splice(gui.roles.indexOf(role));
        await gui.save();
        break;
      }
    }
    await interaction.reply('✅');
  },
};

module.exports = removerole;
