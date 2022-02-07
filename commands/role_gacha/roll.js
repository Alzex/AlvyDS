'use strict';

const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const guild = require('../../models/guild');
const randomTier = require('../../utils/randomTier');

const DAY_IN_MILISECONDS = 86400000;

const roll = {
  data: new SlashCommandBuilder()
    .setName('roll')
    .setDescription('Крутануть гачу на роли!'),
  async execute(interaction) {
    const emb = new MessageEmbed();
    if (!(interaction.guild.me.permissions.has('MANAGE_ROLES') ||
        interaction.guild.me.permissions.has('ADMINISTRATOR'))) {
      emb
        .setTitle('ОШИБКА ❌')
        .setDescription(
          'У бота недостаточно прав для корректной работы команды'
        )
        .addField(
          'Необходимые права:',
          '- Управлять ролями (для выдачи и удаления ролей)'
        );
      await interaction.reply({ embeds: [emb] });
      return;
    }
    const gui = await guild.findById(interaction.guild.id);
    let user = gui.users.filter(
      (user) => user._id === interaction.user.id)[0];

    if (!user) {
      gui.users.push({ _id: interaction.user.id, lastRole: new Date(0) });
      await gui.save();
      user = gui.users.filter(
        (user) => user._id === interaction.user.id)[0];
    }

    const timeDiff = Math.abs(user.lastRole - Date.now());
    if (timeDiff < DAY_IN_MILISECONDS) {
      emb.setTitle('⏳ Рано, подожди еще...');
      await interaction.reply({ embeds: [emb], ephemeral: true });
      return;
    }
    const index = gui.users.indexOf(user);
    user.lastRole = Date.now();
    gui.users[index] = user;
    await gui.save();

    const tier = randomTier();
    const rolesInTier = gui.roles.filter((role) => role.tier === tier.n);
    const roleId =
      rolesInTier[Math.floor(Math.random() * rolesInTier.length)]._id;

    const row = new MessageActionRow().addComponents(
      new MessageButton().setCustomId('y').setStyle('SUCCESS').setLabel('✔️'),
      new MessageButton().setCustomId('n').setStyle('DANGER').setLabel('✖️')
    );
    emb
      .setTitle(`${interaction.user.username} ролит!`)
      .setColor(tier.color)
      .setThumbnail(interaction.user.avatarURL())
      .addField('Роль:', `<@&${roleId}>\n\nЭто **${tier.name}** роль.`);
    await interaction.reply({ embeds: [emb], components: [row] });

    const interFilter = (inter) =>
      (inter.customId === 'y' || inter.customId === 'n') &&
      inter.user.id === interaction.user.id;

    const msg = await interaction.fetchReply();

    const collector = msg.createMessageComponentCollector({
      filter: interFilter,
      idle: 15000,
      dispose: true
    });

    collector.on('collect', async (inter) => {
      const role = await inter.guild.roles.fetch(roleId);
      if (inter.customId === 'y') {
        for (const rol of inter.member.roles.cache) {
          if (gui.roles.find((role) => role._id === rol[1].id)) {
            await inter.member.roles.remove(rol);
          }
        }
        await inter.member.roles.add(role);
      }
      const replyTitle =
        inter.customId === 'y' ?
          `${inter.user.username} выбил роль! ✅` :
          `${inter.user.username} отказался от роли! ❌`;
      emb.setTitle(replyTitle);
      await inter.update({ embeds: [emb], components: [] });
      collector.stop();
    });

    collector.on('end', async (col, reason) => {
      if (reason === 'idle') {
        emb.setFooter({ text: 'Время вышло ⏳' });
        await interaction.editReply({ embeds: [emb], components: [] });
      }
    });
  },
};

module.exports = roll;
