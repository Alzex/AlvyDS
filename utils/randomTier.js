'use strict';

const tiers = require('../config/tiers.json');

/**
 * Gets random tier from probability
 * @returns tier
 */
const randomTier = () => {
  const k = 1 - Math.random();
  for (const tier of tiers) {
    if (k > tier.probability) {
      return tier;
    }
  }

};

module.exports = randomTier;
