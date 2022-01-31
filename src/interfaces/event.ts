import { SimpleClient } from 'index';

export default interface Event {
  name: string;
  once?: boolean;

  execute(client: SimpleClient, ...args: any): void;
}
