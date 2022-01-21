import { SimpleClient } from '../src';
import dotenv from 'dotenv';

dotenv.config();

const client: SimpleClient = new SimpleClient(
  process.env.TOKEN as string,
  process.env.CLIENT_ID as string,
  '/config.json'
)
  .load_commands()
  .load_events();

client.once('ready', () => {
  if (!client.user) return;

  client.user?.setActivity('prdim', { type: 'WATCHING' });
});

client.login();
