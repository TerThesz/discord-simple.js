import { Client, Collection, Intents } from 'discord.js';
import { ClientInitOptions } from 'types';
import fs, { cp } from 'fs';
import command_handler from './handlers/command_handler';
import interaction_handler from './handlers/interaction_handler';
import event_handler from './handlers/event_handler';
import { resolve } from 'path';

export default class CustomClient extends Client {
  public commands_folder: string;
  public commands: Collection<any, any>; /* TODO: proper type */

  public events_folder: string;

  public token: string;
  public client_id: string;

  public guild_id: string | undefined;

  constructor(token: string, client_id: string, options?: ClientInitOptions) {
    super({
      intents: [Intents.FLAGS.GUILDS],
    } as any);

    if (!token) throw new Error(`❌ No token provided!`);
    if (!client_id) throw new Error(`❌ No client id provided!`);

    if (options?.guild_only && !options?.guild_id)
      throw new Error(
        '🆔 You need to provide a guild id when using guild only mode.'
      );

    const path_injection = process.env.DEV == 'true' ? '/' : '../../../../src/';

    this.commands_folder = resolve(
      __dirname + path_injection + (options?.commands_folder || 'commands')
    );
    this.events_folder = resolve(
      __dirname + path_injection + (options?.events_folder || 'events')
    );

    this.token = token;
    this.client_id = client_id;

    if (options?.guild_only) this.guild_id = options?.guild_id;
  }

  public load_commands = (): CustomClient => {
    if (!fs.existsSync(this.commands_folder))
      return this._folder_error(this.events_folder);

    this.once('ready', () => command_handler(this, this.guild_id));
    this.on('interactionCreate', (interaction) =>
      interaction_handler(interaction, this)
    );

    return this;
  };

  public load_events = (): CustomClient => {
    if (!fs.existsSync(this.events_folder))
      return this._folder_error(this.events_folder);

    this.once('ready', () => event_handler(this));

    return this;
  };

  _folder_error = (path: string) => {
    const folder = path.split('/')[path.split('/').length - 1];

    throw new Error(
      `📁 ${folder} folder doesn't exist.\n  You can change the default path of this folder with options.${folder} or with options.home_folder.\n\ncurrent path: ${path}`
    );
  };

  public login = async (
    token?: string,
    cb: Function = () => console.log('\n🔓️  Bot has successfully logged in.\n')
  ): Promise<string> => {
    if (typeof token === 'function') {
      cb = token;
      token = undefined;
    }

    const output = await super.login(token);

    cb();

    return output;
  };
}
