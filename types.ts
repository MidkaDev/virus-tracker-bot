import { PermissionString } from 'discord.js';

export type Command = {
  name: string;
  description: string;
  usage: string;
  guildOnly: boolean;
  cooldown: number;
  aliases?: string[];
  args: boolean;
  permission?: PermissionString[];
  execute: Function;
  command?: {
    name: string;
    description: string;
    usage: string;
    guildOnly: boolean;
    cooldown: number;
    aliases?: string[];
    args: boolean;
    permission?: PermissionString[];
    execute: Function;
  };
};
