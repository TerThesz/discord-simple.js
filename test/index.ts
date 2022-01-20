import { SimpleClient } from '../src';
import dotenv from 'dotenv';
import { Intents } from 'discord.js';

dotenv.config();

const client = new SimpleClient(
  process.env.TOKEN as string,
  process.env.CLIENT_ID as string,
  {
    commands_folder: '../test/commands',
    events_folder: '../test/events',

    guild_only: true,
    guild_id: process.env.GUILD_ID,
  }
)
  .load_commands()
  .load_events()
  .login();
