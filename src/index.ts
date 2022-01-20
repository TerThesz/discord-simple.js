import CustomClient from './client';
import { ClientInitOptions, CommandType } from './types';
import { SimpleCommand, SimpleEvent } from './interfaces';

// TODO: make it async

class SimpleClient extends CustomClient {
  constructor(token: string, client_id: string, options?: ClientInitOptions) {
    super(token, client_id, options);
  }
}

export { SimpleClient, CommandType, SimpleCommand, SimpleEvent };
