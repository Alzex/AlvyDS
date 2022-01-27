'use strict';

const guild = require('../models/guild');
const { MessageEmbed } = require('discord.js');

const roleDelete = {
  name: 'roleDelete',
  async execute(role) {
    const gui = await guild.findById(role.guild.id);
    for (const dbRole of gui.roles) {
      if (dbRole._id === role.id) {
        gui.roles.splice(gui.roles.indexOf(dbRole), 1);
        await gui.save();
        const guildOwner = await role.guild.fetchOwner();
        const chat = await guildOwner.user.createDM();
        const embed = new MessageEmbed({
          title: 'Зафиксровано удаление Роли ❕',
          description:
            'Бот зафиксировал ручное удаление роли с сервера, ' +
            'данная роль убрана из списка и не может быть выбита в дальнейшем',
          fields: [{
            name: 'Роль:',
            value: `@${role.name}`
          }]
        });
        await chat.send({ embeds: [embed] });
      }
    }
  }
};

module.exports = roleDelete;
