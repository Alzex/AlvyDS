'use strict';

const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

const commandlist = {
  data: new SlashCommandBuilder()
    .setName('commandlist')
    .setDescription('DEV')
    .setDefaultPermission(false),

  async execute(interaction) {
    const commands = await interaction.guild.commands.fetch();
    let text = '';
    for (const command of commands.values()) {
      const available = command.defaultPermission ? '✅' : '❌';
      text += `**/${command.name}** [_${command.id}_]\n` +
        `Доступна всем: ${available}\n\n`;
    }
    const emb = new MessageEmbed()
      .setTitle('Список зарегистрированых команд')
      .setDescription(text);
    await interaction.reply({ embeds: [emb], ephemeral: true });
  }
};

module.exports = commandlist;
