import { Interaction } from "discord.js";

type CommandType = {
  name: string;
  description: string;

  execute(interaction: Interaction): Promise<void>;

  slash_command: any;
};

export default CommandType;
