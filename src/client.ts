import { Client, Collection, Intents } from 'discord.js';
import { ClientInitOptions } from 'types';
import fs from 'fs';
import command_handler from './handlers/command_handler';
import interaction_handler from './handlers/interaction_handler';
import event_handler from './handlers/event_handler';
import { resolve } from 'path';
import { SimpleCommand } from 'classes';

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

  /**
   *
   *
   * @param token {string} The bot's token
   * @param client_id {string} The bot's client id
   * @param options {ClientInitOptions} The client's options (optional)
   */
  constructor(token: string, client_id: string, options?: ClientInitOptions) {
    super({
      intents: [options?.intents || Intents.FLAGS.GUILDS],
    } as any);

    if (!token) throw new Error(`❌ No token provided!`);
    if (!client_id) throw new Error(`❌ No client id provided!`);

    if (options?.guild_only && !options?.guild_id)
      throw new Error(
        '🆔 You need to provide a guild id when using guild only mode.'
      );

    this.development_mode =
      (options?.development_mode || process.env.DEV === 'true') ?? false;

    if (this.development_mode) console.log('👷 Development mode enabled.');

    let path_injection =
      process.env.PACKAGE_TESTING === 'true' ? '/' : '../../../../src/';

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

    this.once('ready', () =>
      command_handler(
        this,
        this.guild_id === undefined
          ? undefined
          : this.development_mode || this.guild_only
          ? this.guild_id
          : undefined
      )
    );
    this.on('interactionCreate', (interaction) =>
      interaction_handler(interaction, this)
    );

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

    this.once('ready', () => event_handler(this));

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
