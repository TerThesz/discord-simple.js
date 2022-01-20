import { SlashCommandBuilder } from '@discordjs/builders';
import { CommandInteraction } from 'discord.js';
import { SimpleClient } from 'index';

export default abstract class Command {
  private constructor() {
    this._slash_command = new SlashCommandBuilder();
  }

  name: string;
  description: string;

  aliases?: Array<string>;

  execute: (
    interaction: CommandInteraction,
    client: SimpleClient
  ) => Promise<any>;

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
