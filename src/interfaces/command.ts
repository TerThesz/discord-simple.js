import { Interaction } from "discord.js";

export default interface Command {
  name: string;
  description: string;

  execute(interaction: Interaction): Promise<void>;

  options?: Options;

  subcommands?: Array<{
    name: string;
    description: string;

    options?: Options;
  }>;
}

// change in command handler
type Options = Array<{
  name: string;
  description: string;

  type:
    | "string"
    | "integer"
    | "number"
    | "boolean"
    | "user"
    | "channel"
    | "role"
    | "mentionable";
  required: boolean;

  choices: Array<{
    name: string;
    value: any;
  }>;
}>;
