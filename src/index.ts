import CustomClient from './client';
import { ClientInitOptions } from './types';
import { SimpleEvent } from './interfaces';
import { SimpleCommand } from './classes';
import { resolve } from 'path';
import { EntryData, EntryInfo } from './types';
import fs from 'fs';

/**
 * A discord-simple.js client
 *
 * @class
 * @extends Client
 */
class SimpleClient extends CustomClient {
  /**
   * @param token {string} The bot's token
   * @param client_id {string} The bot's client id
   * @param options {ClientInitOptions | string} The client's options or a path to a configuration file (json) (optional)
   */
  constructor(token: string, client_id: string, options?: ClientInitOptions | string) {
    super(
      token,
      client_id,
      (typeof options === 'string'
        ? JSON.parse(
            fs.readFileSync(
              resolve(__dirname + (process.env.PACKAGE_TESTING === 'true' ? '/../test/' : '../../../../src/') + options),
              'utf8'
            )
          )
        : options) || options
    );
  }
}

export { SimpleClient, SimpleCommand, SimpleEvent, EntryData, EntryInfo };
