type ClientInitOptions = {
  commands_folder?: string;
  events_folder?: string;

  guild_only?: boolean;
  guild_id?: string;
};

export default ClientInitOptions;
