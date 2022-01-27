import { SimpleClient } from 'index';

export default interface Event {
  name: string;
  once?: boolean;

  execute(interaction: any, client: SimpleClient): void;
}
