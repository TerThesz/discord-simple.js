import { SimpleClient } from '../src';
import dotenv from 'dotenv';

import prd from '../src/api';

dotenv.config();

const client: SimpleClient = new SimpleClient(process.env.TOKEN as string, process.env.CLIENT_ID as string, '../test/config.json')
  .load_commands()
  .load_events();

const ahoj = new prd(client, 8080);
ahoj.start(() => console.log('cc'));

client.once('ready', () => {
  if (!client.user) return;

  client.user?.setActivity('prdim', { type: 'WATCHING' });
});

client.login();
