import { Guild } from 'discord.js';
import fs from 'fs';
import { SimpleEvent } from 'index';
import default_events from '../events';
import interaction_handler from './interaction_handler';

export default async (client: any) => {
  await console.log('\n🤔 Loading events...');

  let number_of_events = 0;

  if (client._load_events) {
    const event_files = await fs.readdirSync(client.events_folder).filter((file) => file.endsWith('.event.ts'));

    event_files.forEach(async (event_file) => {
      const event = await new (require(client.events_folder + '/' + event_file).default)(client);

      if (load_event(event)) number_of_events++;
    });
  }

  default_events.forEach(async (event) => load_event(new event()));

  function load_event(event: SimpleEvent): boolean {
    try {
      if (event.once) {
        client.once(event.name, (...args: any[]) => event.execute(client, ...args));
      } else {
        client.on(event.name, (...args: any[]) => event.execute(client, ...args));
      }

      return true;
    } catch (e) {
      console.error(e);

      return false;
    }
  }

  client.on('interactionCreate', (interaction: any) => {
    if (client._load_commands) interaction_handler(interaction, client);
  });

  client.once('error', (error: any) => console.error(`😥 client's WebSocket encountered a connection error: ${error}`));

  client.once('disconnect', () => console.log(`⛔️ the WebSocket has closed and will no longer attempt to reconnect`));

  client.on('guildCreate', (guild: Guild) => client.driver.create_guild_entry(guild.id));
  client.on('guildDelete', (guild: Guild) => client.driver.delete_guild_entry(guild.id));

  if (client._load_events) await console.log(`\n✔️ Successfully registered ${number_of_events} application event/-s.`);
};
