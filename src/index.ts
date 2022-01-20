import CustomClient from './client';
import { ClientInitOptions } from './types';
import { SimpleEvent } from './interfaces';
import { SimpleCommand } from './classes';

class SimpleClient extends CustomClient {
  constructor(token: string, client_id: string, options?: ClientInitOptions) {
    super(token, client_id, options);
  }
}

export { SimpleClient, SimpleCommand, SimpleEvent };
