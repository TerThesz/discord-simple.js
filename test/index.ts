import { SimpleClient } from '../src';
import dotenv from 'dotenv';

dotenv.config();

const client: SimpleClient = new SimpleClient(
  process.env.TOKEN as string,
  process.env.CLIENT_ID as string,
  '../test/config.json'
).load_commands();

client.once('ready', () => {
  if (!client.user) return;

  client.user?.setActivity('prdim', { type: 'WATCHING' });
});

client.login();
