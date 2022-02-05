'use strict';

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const getFiles = require('../utils/getFiles');
require('colors');

if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  dotenv.config();
}

console.log('Deploying commands...');
const guildIds = process.env.GUILD_ID.split(',');

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

const permissionType = {
  ROLE: 1,
  USER: 2,
};

const devPermission = [];

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN_TEST);

console.log('Deploying for guilds...');
for (const guildId of guildIds) {

  const restUrl = Routes.applicationGuildCommands(
    process.env.CLIENT_ID_TEST,
    guildId
  );
  rest
    .put(restUrl, { body: commands })
    .then(async (commandList) => {
      console.log(`${'DEPLOYED'.green} for ${guildId}`);
      console.log('Setting up permissions for dev commands...');
      for (const command of commandList) {
        if (devOnly.includes(command.name)) {
          console.log(`${command.name} setted`);
          devPermission.push({
            id: command.id,
            permissions: [{
              id: process.env.DEV_ID,
              type: permissionType.USER,
              permission: true
            }]
          });
        }
      }
      const restPermUrl = Routes.guildApplicationCommandsPermissions(
        process.env.CLIENT_ID_TEST,
        guildId
      );
      await rest
        .put(restPermUrl, { body: devPermission })
        .catch((e) => console.log(e));
      console.log(`${'DONE'.green} for ${guildId}`);
    })
    .catch((err) =>
      console.log(
        `${'FAILED'.red} for ${guildId} ${`Error code: ${err.code}`.yellow}`
      )
    );
}

console.log('Deploying for GLOBAL...');
const globalUrl = Routes.applicationCommands(process.env.CLIENT_ID_TEST);

rest.put(globalUrl, { body: commands })
  .catch((err) =>
    console.log(
      `${'FAILED'.red} for GLOBAL ${`Error code: ${err.code}`.yellow}`
    )
  ).then(console.log(`${'DEPLOYED'.green} for GLOBAL`));
