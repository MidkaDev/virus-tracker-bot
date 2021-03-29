import { Client } from 'discord.js';

const { version } = require('./../config/config.json');
module.exports = (client: Client) => {
  console.log(`Logged in as user ${client.user!.tag}!`);
  client.user!.setActivity('Version: ' + version);
};
