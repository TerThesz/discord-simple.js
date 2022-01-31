import { Client, Collection, Intents } from 'discord.js';
import { ClientInitOptions } from 'types';
import fs from 'fs';
import { resolve } from 'path';
import { SimpleCommand, SimpleDriver } from 'classes';
import { Dashboard, Locale } from './types/client_init_options';
import { JsonDriver } from './drivers';

/**
 * A discord-simple.js client
 *
 * @class
 * @extends Client
 */
export default class CustomClient extends Client {
  public commands_folder: string;
  public commands: Collection<string, SimpleCommand>;

  public events_folder: string;

  /**
   * Used for cooldowns
   */
  public timestamps: Array<{
    user_id: string;
    command_name: string;
    timestamp: number;
  }>;

  public token: string;
  public client_id: string;

  public guild_id: string | undefined;
  public guild_only: boolean;

  public development_mode: boolean;

  public join_roles: Array<string> | undefined;
  public set_roles_on_join: boolean;

  _load_commands: boolean;
  _load_events: boolean;

  public welcomes_and_goodbyes: boolean;
  public welcome_channel_id: string | undefined;

  // TODO: Add more options
  public locale: Locale;

  public anti_server_advertising: boolean;
  public anti_server_advertising_regex: RegExp | undefined;

  public dashboard: Dashboard | undefined;

  path_injection: string;

  public driver: SimpleDriver;

  client_path: string;

  /**
   * @param token {string} The bot's token
   * @param client_id {string} The bot's client id
   * @param options {ClientInitOptions} The client's options (optional)
   */
  constructor(token: string, client_id: string, options?: ClientInitOptions) {
    super({
      intents: options?.intents || [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES],
    });

    this.client_path = __dirname;

    const default_intents = [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES];

    if (options?.intents && options.intents.filter((intent) => default_intents.includes(intent)).length !== default_intents.length)
      console.log(`🛑  Intents: ${default_intents} are required to run the bot.\n`);

    if (!token) throw new Error(`❌ No token provided!`);
    if (!client_id) throw new Error(`❌ No client id provided!`);

    this.path_injection = process.env.PACKAGE_TESTING === 'true' ? '/../test/' : '../../../../src/';

    if (options?.guild_only && !options?.guild_id) throw new Error('🆔 You need to provide a guild id when using guild only mode.');

    this.development_mode = (options?.development_mode || process.env.DEV === 'true') ?? false;

    if (this.development_mode) console.log('👷 Development mode enabled.\n');
    if (this.development_mode && !options?.guild_id) {
      console.warn(
        '⚠️ You are running the bot in development mode without providing a guild id.\n' +
          'This means that all commands will registered application wide.\n'
      );
    }

    if (options?.home_folder) {
      this.path_injection += 'home_folder';

      if (this.path_injection[this.path_injection.length - 1] !== '/') this.path_injection += '/';
    }

    this.commands_folder = resolve(__dirname + this.path_injection + (options?.commands_folder || 'commands'));
    this.events_folder = resolve(__dirname + this.path_injection + (options?.events_folder || 'events'));

    this.token = token;
    this.client_id = client_id;

    this.guild_id = options?.guild_id;
    this.guild_only = options?.guild_only ?? false;

    this.join_roles = options?.join_roles;
    if ((options?.set_roles_on_join === undefined && this.join_roles) || options?.set_roles_on_join) this.set_roles_on_join = true;

    this.welcome_channel_id = options?.welcome_channel_id;
    if ((options?.welcomes_and_goodbyes === undefined && this.welcome_channel_id) || options?.welcomes_and_goodbyes)
      this.welcomes_and_goodbyes = true;

    this.anti_server_advertising = options?.anti_server_advertising ?? false;
    this.anti_server_advertising_regex = options?.anti_server_advertising_regex;

    this.dashboard = options?.dashboard;
    if (this.dashboard && this.dashboard.enabled) {
      if (this.dashboard.driver === 'custom') {
        if (!this.dashboard.custom_driver_path) throw new Error('⛔️ Dashboard: No custom driver path provided!\n');

        this.dashboard.custom_driver_path = resolve(__dirname + this.path_injection + this.dashboard.custom_driver_path);

        if (
          !['ts', 'js', 'driver.ts', 'driver.js'].find(
            (ext) => ext === this.dashboard?.custom_driver_path?.split('.')[this.dashboard.custom_driver_path.split('.').length - 1]
          )
        )
          throw new Error('⛔️ Dashboard: Unsupported driver extension! Only .ts, .js, driver.ts and driver.js are supported.\n');

        if (!fs.existsSync(this.dashboard.custom_driver_path))
          return this._folder_error(this.dashboard.custom_driver_path, 'dashboard.custom_driver_path');

        this.driver = require(this.dashboard.custom_driver_path + '').default || require(this.dashboard.custom_driver_path + '');
      }

      if (options?.dashboard?.driver === 'json') {
        if (!this.dashboard.storage_path_for_json_driver)
          throw new Error(
            '⛔️ Dashboard: No storage path provided for json driver! You can set it using options.dashboard.storage_path_for_json_driver. Or with options.home_folder\n'
          );

        this.driver = new JsonDriver(this.dashboard.storage_path_for_json_driver, this);
      }

      if (!this.dashboard.driver) throw new Error('⛔️ Dashboard: No driver provided!\n');

      if (this.dashboard.whitelist === false) console.log('⚠️ Dashboard: Whitelist turned off. This is not recommended.\n');
      if (this.dashboard.whitelist === undefined) {
        this.dashboard.whitelist = true;
        console.log('⚠️ Dashboard: Whitelist turned on by default.\n');
      }
      if (this.dashboard.whitelist && !this.dashboard.allowed_addresses) {
        this.dashboard.allowed_addresses = [];
        console.log('⚠️ Dashboard: No allowed addresses provided.\n');
      }

      this.dashboard.use_cache = options?.dashboard?.use_cache ?? true;
      this.dashboard.cache_timeout = options?.dashboard?.cache_timeout ?? 600;
    }
  }

  /**
   * A function that loads all commands from the commands/ folder.
   *  path can be changed using the client options.
   *
   * @returns {CustomClient} The client itself
   */
  public load_commands = (): CustomClient => {
    if (!fs.existsSync(this.commands_folder)) return this._folder_error(this.commands_folder);

    this._load_commands = true;

    return this;
  };

  /**
   * A function that loads all events from the events/ folder.
   *   path can be changed using the client options.
   *
   * @returns {CustomClient} The client itself
   */
  public load_events = (): CustomClient => {
    if (!fs.existsSync(this.events_folder)) return this._folder_error(this.events_folder);

    this._load_events = true;

    return this;
  };

  /**
   * A function that returns an error message when a folder is not found.
   *
   * @private
   * @param path {string}
   */
  _folder_error = (path: string, option?: string) => {
    const folder = path.split('/')[path.split('/').length - 1];

    throw new Error(
      `📁 ${folder} folder doesn't exist.\n  You can change the default path of this folder with ${option || 'options.' + folder}${
        option ? '' : ' or with options.home_folder'
      }.\n\ncurrent path: ${path}`
    );
  };

  /**
   * Client.login() with a callback function.
   *
   * @param token {string | Function} - The bot's token (optional)
   * @param cb {Function} - A callback function (optional)
   * @returns {Promise<string>} - The bot's token
   */
  public login = async (
    token?: string | Function,
    cb: Function = () => console.log('\n🔓️  Bot has successfully logged in.')
  ): Promise<string> => {
    if (typeof token === 'function') {
      cb = token;
      token = undefined;
    }

    const output = await super.login(token);

    await cb();

    return output;
  };
}
