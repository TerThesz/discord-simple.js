import { SimpleClient } from '../src';
import dotenv from 'dotenv';

jest.useFakeTimers();

dotenv.config();

/*
 * TODO: add these thing everywhere
 */

describe('discord-simple.js', () => {
  it('init server', async () => {
    const client = await SimpleClient(
      process.env.TOKEN,
      process.env.CLIENT_ID,
      {
        commands_folder: '../test/commands',

        guild_id: process.env.GUILD_ID,
        guild_only: true,
      }
    )
      .load_commands()
      .login();
  });
});
