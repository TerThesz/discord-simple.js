import { Intents } from 'discord.js';

type ClientInitOptions = {
  commands_folder?: string;
  events_folder?: string;

  guild_only?: boolean;
  guild_id?: string;

  intents?: Array<number>;
};

export default ClientInitOptions;
