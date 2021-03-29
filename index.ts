require('dotenv').config();
import * as fs from 'fs';
import * as Discord from 'discord.js';
import { Message } from 'discord.js';
import { Command } from './types';

import { prefix, defaultCooldownAmount } from './config/config.json';
const { token } = process.env;

const client = new Discord.Client();

// Cooldown list
const cooldowns = new Discord.Collection();

// Command Handler
client.commands = new Discord.Collection();

// Reading all files in commands directory
const cmdFiles = fs
  .readdirSync('./commands')
  .filter((file: string) => file.endsWith('.js'));

for (const file of cmdFiles) {
  const cmd: Command = require(`./commands/${file}`);
  console.log(JSON.stringify(cmd));
  client.commands.set(cmd.command!.name, cmd.command!);
}

// Commands or something
client.on('message', (message: Message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args: string[] = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/);

  const commandName = args.shift()?.toLowerCase();

  const command: Command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd: Command) => cmd.aliases && cmd.aliases.includes(commandName!)
    );

  if (!command) return;

  if (command.args && !args.length) {
    let reply = `You didn't provide any arguments, ${message.author}`;

    if (command.usage) {
      reply += `\nThe proper usage would be: \`${prefix}${command.name} ${command.usage}`;
    }
    return message.channel.send(reply);
  }
  if (command.guildOnly && message.channel.type !== 'text') {
    return message.reply("I can't execute that command inside DMs!");
  }

  if (!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
  }

  if (
    command.permission &&
    !message.member?.permissions.has(command.permission)
  ) {
    return message.reply(`No permission! Required: ${command.permission}`);
  }

  const now = Date.now();
  const timestamps: any = cooldowns.get(command.name);
  const cooldownAmount = (command.cooldown || defaultCooldownAmount) * 1000;

  if (timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
      const timeLeft = (expirationTime - now) / 1000;
      return message.reply(
        `please wait ${timeLeft.toFixed(
          1
        )} more second(s) before reusing the \`${command.name}\` command.`
      );
    }
  }

  timestamps.set(message.author.id, now);
  setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('An error occurred');
  }
});

fs.readdir('./events/', (err: any, files: string[]) => {
  if (err) {
    console.error(err);
  }
  files.forEach((file: string) => {
    if (!file.endsWith('.js')) return;
    const evt = require(`./events/${file}`);
    let evtName = file.split('.')[0];
    client.on(evtName, evt.bind(null, client));
  });
});

client.login(token);
