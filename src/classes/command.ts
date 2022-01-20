import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { SimpleClient } from 'index';

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

  permissions?: Permissions;
  use_without_permission?: boolean;

  abstract execute(
    interaction: CommandInteraction,
    client: SimpleClient
  ): Promise<any>;

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

type Permissions = Array<{
  id: string;
  type: string;
  permission: boolean;
}>;
