import { SlashCommandBuilder } from '@discordjs/builders';
import { PermissionResolvable, PermissionString } from 'discord.js';
import { SimpleClient } from 'index';
import { SimpleInteraction } from 'interfaces';

export default abstract class Command {
  constructor() {
    this._slash_command = new SlashCommandBuilder();
  }

  name: string;
  description: string;

  cooldown?: number;
  global_cooldown?: number;

  aliases?: Array<string>;

  owner_only?: boolean;

  permissions?: Array<string>;
  use_without_permission?: boolean;

  abstract execute(interaction: SimpleInteraction, client: SimpleClient): Promise<any>;

  options?: Options;

  subcommands?: Subcommands;

  readonly _slash_command?: any;
}

type Options = Array<{
  name: string;
  description: string;

  type: string;
  required?: boolean;

  choices?: Array<{
    name: string;
    value: any;
  }>;
}>;

type Subcommands = Array<{
  name: string;
  description: string;

  options?: Options;
}>;
