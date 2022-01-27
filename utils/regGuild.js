'use strict';

const Guild = require('../models/guild');
/**
 * Registers guild in DB
 * @param {String} guildId Id of the guild
 */
const regGuild = async (guildId) => {
  await new Guild({
    _id: guildId
  }).save();
};

module.exports = regGuild;
