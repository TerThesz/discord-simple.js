import { Client, Collection, Intents } from 'discord.js';
import { ClientInitOptions } from 'types';
import fs from 'fs';
import { resolve } from 'path';
import { SimpleCommand } from 'classes';
import default_events_handler from './handlers/default_event_handler';
import { Locale } from './types/client_init_options';

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

  public locale: Locale;

  public anti_server_advertising: boolean;
  public anti_server_advertising_regex: RegExp | undefined;

  /**
   * @param token {string} The bot's token
   * @param client_id {string} The bot's client id
   * @param options {ClientInitOptions} The client's options (optional)
   */
  constructor(token: string, client_id: string, options?: ClientInitOptions) {
    super({
      intents: options?.intents || [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.GUILD_MESSAGES,
      ],
    });

    const default_intents = [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MEMBERS,
      Intents.FLAGS.GUILD_MESSAGES,
    ];

    if (
      options?.intents &&
      options.intents.filter((intent) => default_intents.includes(intent))
        .length !== default_intents.length
    )
      console.log(
        `🛑  Intents: ${default_intents} are required to run the bot.\n`
      );

    if (!token) throw new Error(`❌ No token provided!`);
    if (!client_id) throw new Error(`❌ No client id provided!`);

    let path_injection =
      process.env.PACKAGE_TESTING === 'true' ? '/../test/' : '../../../../src/';

    if (options?.guild_only && !options?.guild_id)
      throw new Error(
        '🆔 You need to provide a guild id when using guild only mode.'
      );

    this.development_mode =
      (options?.development_mode || process.env.DEV === 'true') ?? false;

    if (this.development_mode) console.log('👷 Development mode enabled.');

    if (options?.home_folder) {
      path_injection += 'home_folder';

      if (path_injection[path_injection.length - 1] !== '/')
        path_injection += '/';
    }

    this.commands_folder = resolve(
      __dirname + path_injection + (options?.commands_folder || 'commands')
    );
    this.events_folder = resolve(
      __dirname + path_injection + (options?.events_folder || 'events')
    );

    this.token = token;
    this.client_id = client_id;

    this.guild_id = options?.guild_id;
    this.guild_only = options?.guild_only ?? false;

    this.join_roles = options?.join_roles;
    if (
      (options?.set_roles_on_join === undefined && this.join_roles) ||
      options?.set_roles_on_join
    )
      this.set_roles_on_join = true;

    this.welcome_channel_id = options?.welcome_channel_id;
    if (
      (options?.welcomes_and_goodbyes === undefined &&
        this.welcome_channel_id) ||
      options?.welcomes_and_goodbyes
    )
      this.welcomes_and_goodbyes = true;

    this.anti_server_advertising = options?.anti_server_advertising ?? false;
    this.anti_server_advertising_regex = options?.anti_server_advertising_regex;

    default_events_handler(this);
  }

  /**
   * A function that loads all commands from the commands/ folder.
   *  path can be changed using the client options.
   *
   * @returns {CustomClient} The client itself
   */
  public load_commands = (): CustomClient => {
    if (!fs.existsSync(this.commands_folder))
      return this._folder_error(this.commands_folder);

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
    if (!fs.existsSync(this.events_folder))
      return this._folder_error(this.events_folder);

    this._load_events = true;

    return this;
  };

  /**
   * A function that returns an error message when a folder is not found.
   *
   * @private
   * @param path {string}
   */
  private _folder_error = (path: string) => {
    const folder = path.split('/')[path.split('/').length - 1];

    throw new Error(
      `📁 ${folder} folder doesn't exist.\n  You can change the default path of this folder with options.${folder} or with options.home_folder.\n\ncurrent path: ${path}`
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
