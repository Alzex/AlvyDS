'use strict';

const tiers = require('../config/tiers.json');

/**
 * Gets random tier from probability
 * @returns tier
 */
const randomTier = () => {
  const k = Math.random();
  for (const tier of tiers.reverse()) {
    if (k >= 1 - tier.probability) {
      tiers.reverse();
      return tier;
    }
  }
  tiers.reverse();
  return tiers[0];

};

module.exports = randomTier;
