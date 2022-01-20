type ClientInitOptions = {
  commands_folder?: string;
  events_folder?: string;

  guild_only?: boolean;
  guild_id?: string;

  intents?: Array<number>;

  development_mode?: boolean;

  home_folder?: string;
};

export default ClientInitOptions;
