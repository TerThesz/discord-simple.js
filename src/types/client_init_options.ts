type ClientInitOptions = {
  commands_folder?: string;
  events_folder?: string;

  guild_only?: boolean;
  guild_id?: string;

  intents?: Array<number>;

  development_mode?: boolean;

  home_folder?: string;

  join_roles?: Array<string>;
  set_roles_on_join?: boolean;

  welcomes_and_goodbyes?: boolean;
  welcome_channel_id?: string;

  /**
   *   @field %user% - The user's mention
   *   @field %user_id% - The user's id
   *   @field %user_name% - The user's name
   *
   *   @field %guild% - The guild's name
   *   @field %guild_id% - The guild's id
   */
  locale?: Locale;

  anti_server_advertising?: boolean;
  anti_server_advertising_regex?: RegExp;

  dashboard?: Dashboard;
};

export default ClientInitOptions;
export { Locale, Dashboard };

type LocaleKeys = 'welcome_message' | 'goodbye_message';

type Locale = {
  [key in LocaleKeys]?: string;
};

type DashboardDriver = 'json' | 'mongodb' | 'custom';

type Dashboard = {
  enabled: boolean;
  driver: DashboardDriver;

  whitelist?: boolean;
  allowed_addresses?: Array<string>;

  custom_driver_path?: string;
};
