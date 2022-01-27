'use strict';

const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const {
  SlashCommandBuilder,
  SlashCommandNumberOption,
} = require('@discordjs/builders');
const { getPage, getMaxPages } = require('../../utils/getPages');

const rolelist = {
  data: new SlashCommandBuilder()
    .setName('rolelist')
    .setDescription('Список ролей на сервере')
    .addNumberOption(
      new SlashCommandNumberOption()
        .setName('tier')
        .setDescription('Список конкретного тира')
        .addChoice('Обычные', 0)
        .addChoice('Необычные', 1)
        .addChoice('Редкие', 2)
        .addChoice('Очень редкие', 3)
        .addChoice('Легендарные', 4)
        .addChoice('Уникальные', 5)
    ),
  async execute(interaction) {
    const tier = interaction.options.getNumber('tier');
    const emb = new MessageEmbed()
      .setTitle(`Список ролей ${interaction.guild.name}`)
      .setThumbnail(interaction.guild.iconURL())
      .setDescription('Список ролей и их тир, установленный администратором');
    const maxPages = await getMaxPages(interaction.guild.id, tier);
    const row = maxPages > 1 ?
      [new MessageActionRow()
        .addComponents(
          new MessageButton()
            .setLabel('⬅')
            .setStyle('PRIMARY')
            .setCustomId('prev')
            .setDisabled(true),
          new MessageButton()
            .setLabel('➡')
            .setStyle('PRIMARY')
            .setCustomId('next')
        )] : [];

    emb.addField('Роли:', (await getPage(interaction.guild.id, tier))[0]);
    emb.setFooter({ text: `Страница 1/${maxPages}` });

    await interaction.reply({ embeds: [emb], components: row });
    const msg = await interaction.fetchReply();
    if (maxPages === 1) return;

    let curPage = 0;
    const collector = msg.createMessageComponentCollector({ idle: 60000 });
    collector.on('collect', async (inter) => {
      if (inter.customId === 'next') curPage++;
      else curPage--;
      emb.spliceFields(0, 1, {
        name: 'Роли',
        value: (await getPage(interaction.guild.id, tier))[curPage]
      });
      emb.setFooter({ text: `Страница ${curPage + 1}/${maxPages}` });
      row[0].components[0].setDisabled(!(curPage > 0));
      row[0].components[1].setDisabled(curPage === maxPages - 1);
      inter.update({ embeds: [emb], components: row });
    });

    collector.on('end', async (col, reason) => {
      if (reason === 'idle') {
        emb.setFooter({
          text: '⏳ Время взаимодействия истекло,' +
          'для просмотра других страниц повторите вызов команды'
        });
        await interaction.editReply({ embeds: [emb], components: [] });
      }
    });
  },
};

module.exports = rolelist;
