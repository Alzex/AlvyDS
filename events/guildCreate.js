'use strict';

const EventHandler = require('../core/event');
const regGuild = require('../utils/regGuild');

const guildCreate = new EventHandler('guildCreate', async (guild) =>
  await regGuild(guild.id)
);

module.exports = guildCreate;
