'use strict';

const fs = require('fs');
/**
 * Function to get files from `dir` with specific `suffix`(type)
 * @param {String} dir Root directory to get files from
 * @param {String} suffix Type of file
 * @returns {String[]} Array of files
 */
const getFiles = (dir, suffix) => {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  let result = [];
  for (const file of files) {
    if (file.isDirectory()) {
      result = [
        ...result,
        ...getFiles(`${dir}/${file.name}`, suffix)
      ];
    } else if (file.name.endsWith(suffix)) {
      result.push(`${dir}/${file.name}`);
    }
  }
  return result;
};

module.exports = getFiles;
