import { Message } from 'discord.js';

import { Command } from './../types';

const { prefix, defaultCooldownAmount } = require('./../config/config.json');

export const command: Command = {
  name: 'help',
  description: 'List all of my commands or info about a specific command.',
  aliases: ['commands'],
  usage: '[command name]',
  cooldown: 5,
  guildOnly: false,
  args: false,
  execute(message: Message, args: string[]) {},
};
