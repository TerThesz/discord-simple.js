import { Guild } from 'discord.js';
import { SimpleEvent } from 'index';
import { resolve } from 'path';
import { scan_files } from '../utils';
import default_events from '../events';

export default async (client: any, load_default_events: boolean = false) => {
  let number_of_events = 0;

  if (!load_default_events) {
    await console.log('\n🤔 Loading events...');

    const event_files = (await scan_files(resolve(client.events_folder + '/**/*'))).filter((file) => file.endsWith('.event.ts'));

    event_files.forEach(async (event_file) => {
      const event = await new (require(resolve(client.events_folder + '/' + event_file.replace(client.events_folder, ''))).default)(client);

      if (load_event(event)) number_of_events++;
    });
  } else default_events.forEach(async (event) => load_event(new event()));

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

  if (!load_default_events) await console.log(`\n✔️ Successfully registered ${number_of_events} application event/-s.`);
};
