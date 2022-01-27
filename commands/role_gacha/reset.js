'use strict';

const guild = require('../../models/guild');
const {
  SlashCommandBuilder,
  SlashCommandUserOption,
} = require('@discordjs/builders');

const reset = {
  data: new SlashCommandBuilder()
    .setName('reset')
    .setDescription('Сброс времени [DEV ONLY]')
    .addUserOption(
      new SlashCommandUserOption()
        .setName('user')
        .setDescription('User to reset time')
    )
    .setDefaultPermission(false),

  async execute(interaction) {
    const gui = await guild.findById(interaction.guild.id);
    const user = interaction.options.getUser('user');
    const userId = !user ? interaction.user.id : user.id;
    const us = gui.users.filter((user) => user._id === userId)[0];
    const index = gui.users.indexOf(us);
    us.lastRole = new Date(0);
    gui.users[index] = us;
    await gui.save();
    interaction.reply({ content: '✅', ephemeral: true });
  },
};

module.exports = reset;
