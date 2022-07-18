'use strict';

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const getFiles = require('../utils/getFiles');
require('colors');

if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  dotenv.config();
}

console.log(process.env.TOKEN);

console.log('Deploying commands...');
const guildIds = process.env.ALVY_GUILD_ID.split(',');

const commands = [];
const devOnly = [];
const commandFiles = getFiles('./commands', '.js');

for (const file of commandFiles) {
  console.log(`${file} command queued`);
  const command = require('.' + file);
  const commandData = command.data.toJSON();
  commands.push(commandData);
  if (commandData.default_permission === false) {
    devOnly.push(commandData.name);
  }
}

const rest = new REST({ version: '9' }).setToken(process.env.ALVY_TOKEN);

console.log('Deploying for guilds...');
for (const guildId of guildIds) {

  const restUrl = Routes.applicationGuildCommands(
    process.env.CLIENT_ID,
    guildId
  );
  rest
    .put(restUrl, { body: commands })
    .then(console.log(`${'DEPLOYED'.green} for ${guildId}`))
    .catch((err) =>
      console.log(
        `${'FAILED'.red} for ${guildId} ${`Error code: ${err.code}`.yellow}`
      )
    );
}

console.log('Deploying for GLOBAL...');
const globalUrl = Routes.applicationCommands(process.env.ALVY_CLIENT_ID);

rest.put(globalUrl, { body: commands })
  .catch((err) =>
    console.log(
      `${'FAILED'.red} for GLOBAL ${`Error code: ${err.code}`.yellow}`
    )
  ).then(console.log(`${'DEPLOYED'.green} for GLOBAL`));
