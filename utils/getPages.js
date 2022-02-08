'use strict';

const guild = require('../models/guild');
const tiers = require('../config/tiers.json');
/**
 * @param {String} guildId Id of the guild
 * @param {Number} tier filter for one tier
 * @returns {Promise<Number>} Max amount of pages in the guild role list
 */
const getMaxPages = async (guildId, tier = null) => {
  const roles = (await guild.findById(guildId)).roles;
  if (!tier) return Math.ceil(roles.length / 10);
  const filtredRoles = roles.filter((role) => role.tier === tier);
  return Math.ceil(filtredRoles.length / 10);
};
/**
 * @param {String} guildId Id of the guild
 * @param {*} tier filter for one tier
 * @returns {Promise<String[]>} Descriprtions for each page
 */
const getPage = async (guildId, tier = null) => {
  const fetchedRoles = await guild.findById(guildId);
  const roles = !tier ?
    fetchedRoles.roles :
    fetchedRoles.roles.filter((role) => role.tier === tier);
  const result = [];
  const temp = [];
  for (const role of roles) {
    temp.push(`<@&${role._id}> **${tiers[role.tier].name}** роль\n`);
    if (temp.length === 10) {
      result.push(temp.join(''));
      temp.length = 0;
    }
  }
  if (temp !== []) {
    result.push(temp.join(''));
    temp.length = 0;
  }
  return result;
};

module.exports = { getPage, getMaxPages };
