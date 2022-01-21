import CustomClient from './client';
import { ClientInitOptions } from './types';
import { SimpleEvent } from './interfaces';
import { SimpleCommand } from './classes';

/**
 * A discord-simple.js client
 *
 * @class
 * @extends Client
 */
class SimpleClient extends CustomClient {
  /**
   * @param token
   * @param client_id
   * @param options
   */
  constructor(token: string, client_id: string, options?: ClientInitOptions) {
    super(token, client_id, options);
  }
}

export { SimpleClient, SimpleCommand, SimpleEvent };
