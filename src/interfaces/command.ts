import { CommandInteraction } from 'discord.js';
import { SimpleClient } from 'index';

export default interface Command {
  name: string;
  description: string;

  execute(interaction: CommandInteraction, client: SimpleClient): Promise<any>;

  options?: Options;

  subcommands?: Subcommands;
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
