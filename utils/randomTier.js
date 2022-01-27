'use strict';

const probs = require('../config/probs_config.json');
const tierColor = require('../config/tier_colors.json');

/**
 * Gets random tier from probability in `/config/probs_config.json`
 * @returns tier
 */
const randomTier = () => {
  const k = Math.random();
  if (k >= 1 - probs.absolute)
    return { n: 5, color: tierColor.absolute, name: 'Уникальная' };
  else if (k >= 1 - probs.legendary)
    return { n: 4, color: tierColor.legendary, name: 'Легендарная' };
  else if (k >= 1 - probs.veryRare)
    return { n: 3, color: tierColor.veryRare, name: 'Очень редкая' };
  else if (k >= 1 - probs.rare)
    return { n: 2, color: tierColor.rare, name: 'Редкая' };
  else if (k >= 1 - probs.uncommon)
    return { n: 1, color: tierColor.uncommon, name: 'Необычная' };
  else return { n: 0, color: tierColor.common, name: 'Обычная' };
};

module.exports = randomTier;
