import fs from "fs";

export default (client: any) => {
  console.log("🤔 Loading events...\n");

  const event_files = fs
    .readdirSync(client.events_folder)
    .filter((file) => file.endsWith(".event.ts"));

  for (const event_file of event_files) {
    const event = new (require(client.events_folder +
      "/" +
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

      console.log(`  👍️ Registering event: ${event.name}\n`);
    } catch (e) {
      console.error(e);
    }
  }

  console.log("✔️ Successfully registered application events.");
};
