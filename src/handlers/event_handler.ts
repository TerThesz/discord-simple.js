import fs from 'fs';
import { SimpleEvent } from 'index';
import default_events from '../events';

export default async (client: any) => {
  await console.log('\n🤔 Loading events...');

  let number_of_events = 0;

  const event_files = await fs.readdirSync(client.events_folder).filter((file) => file.endsWith('.event.ts'));

  event_files.forEach(async (event_file) => {
    const event = await new (require(client.events_folder + '/' + event_file).default)();

    if (load_event(event)) number_of_events++;
  });

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

  await console.log(`\n✔️ Successfully registered ${number_of_events} application event/-s.`);
};
