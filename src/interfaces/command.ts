import { Interaction } from "discord.js";

export default interface Command {
  name: string;
  description: string;

  execute(interaction: Interaction): Promise<void>;

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
