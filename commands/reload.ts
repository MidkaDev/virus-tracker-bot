import { Message } from 'discord.js';
import { Command } from '../types';

export const command: Command = {
  name: 'reload',
  description: 'Reloads a command',
  usage: '<command>',
  guildOnly: false,
  cooldown: 5,
  args: false,

  execute(message: Message, args: string[]) {
    if (!args.length)
      return message.channel.send(
        `You didn't pass any command to reload, ${message.author}!`
      );
    const commandName = args[0].toLowerCase();
    const command =
      message.client.commands.get(commandName) ||
      message.client.commands.find(
        (cmd: Command) => cmd.aliases && cmd.aliases.includes(commandName)
      );

    if (!command)
      return message.channel.send(
        `There is no command with name or alias \`${commandName}\`, ${message.author}!`
      );
    delete require.cache[require.resolve(`./${command.name}.js`)];
    try {
      const newCommand = require(`./${command.name}.js`);
      message.client.commands.set(newCommand.name, newCommand);
      message.channel.send(`Command \`${command.name}\` was reloaded!`);
    } catch (error) {
      console.log(error);
      message.channel.send(
        `There was an error while reloading a command \`${command.name}\`:\n\`${error.message}\``
      );
    }
  },
};
