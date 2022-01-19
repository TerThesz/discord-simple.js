import { SimpleClient } from '../src';
import dotenv from 'dotenv';

jest.useFakeTimers();

dotenv.config();

/*
 * TODO: add these thing everywhere
 */

let client: any;

beforeAll(() => {
  client = new SimpleClient(process.env.TOKEN, process.env.CLIENT_ID, {
    commands_folder: '../test/commands',

    guild_id: process.env.GUILD_ID,
    guild_only: true,
  })
    .load_commands()
    .login();

  console.log(client);
});

describe('discord-simple.js', () => {
  it('init server', () => {
    console.log(client);
    expect(1).toBe(1);
  });
});

afterAll(() => {
  client.destroy();
});
