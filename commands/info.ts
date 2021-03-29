import { Message } from 'discord.js';
import { Command } from '../types';

const Discord = require('discord.js');
import { blue } from './../config/colors.json';
const { getData } = require('./../utils');

export const command: Command = {
  name: 'info',
  description: 'Get info about some viruses',
  usage: '<country|all>',
  aliases: ['stats', 'stat', 'i'],
  guildOnly: false,
  cooldown: 10,
  args: true,
  async execute(message: Message, args: string[]) {
    const { client, author, channel } = message;
    const embed = new Discord.MessageEmbed();

    const data = await getData('all');

    embed.setColor(blue);

    if (args[0] === 'all') {
      embed.setTitle('Stats Worldwide');
    } else {
      embed.setTitle(args[0]);
    }

    embed.setDescription(data);

    channel.send(embed);
  },
};
