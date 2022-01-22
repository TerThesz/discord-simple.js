import fs from 'fs';

export default async (client: any) => {
  await console.log('\n🤔 Loading events...');

  let number_of_events = 0;

  const event_files = await fs
    .readdirSync(client.events_folder)
    .filter((file) => file.endsWith('.event.ts'));

  await event_files.forEach(async (event_file) => {
    const event = await new (require(client.events_folder +
      '/' +
      event_file).default)();

    try {
      if (event.once) {
        client.once(event.name, (...args: any[]) =>
          event.execute(...args, client)
        );
      } else {
        client.on(event.name, (...args: any[]) =>
          event.execute(...args, client)
        );
      }

      number_of_events++;
    } catch (e) {
      console.error(e);
    }
  });

  await console.log(
    `\n✔️ Successfully registered ${number_of_events} application event/-s.`
  );
};
