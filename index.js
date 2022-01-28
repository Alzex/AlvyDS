'use strict';

const { Client } = require('./core/client');
const { Intents } = require('discord.js');
const fs = require('fs');
const mongoose = require('mongoose');
const getFiles = require('./utils/getFiles');

if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv');
  dotenv.config();
}

const bot = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.DIRECT_MESSAGES,
  ],
});

bot.once('ready', async () => {
  console.log('Registring event handlers...');
  const eventFiles = fs
    .readdirSync('./events')
    .filter((file) => file.endsWith('.js'));

  for (const file of eventFiles) {
    console.log(`${file.replace('.js', '')} event registered`);
    const event = require(`./events/${file}`);
    if (event.once) {
      bot.once(event.name, async (...args) => await event.execute(...args));
    } else {
      bot.on(event.name, async (...args) => await event.execute(...args));
    }
  }
  const commandFiles = getFiles('./commands', '.js');

  for (const file of commandFiles) {
    const command = require(file);
    bot.commands.set(command.data.name, command);
  }
  await mongoose.connect(process.env.DB_URL, { keepAlive: true });
  console.log('READY!');
});

bot.login(process.env.TOKEN);
