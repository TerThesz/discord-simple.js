import fs from "fs";

export default (client: any) => {
  const event_files = fs
    .readdirSync("src/events")
    .filter((file) => file.endsWith(".event.ts"));

  for (const event_file of event_files) {
    const event = new (require("../events/" + event_file).default)();

    try {
      if (event.once)
        return client.once(event.name, (...args: any[]) =>
          event.execute(...args, client)
        );
      return client.on(event.name, (...args: any[]) =>
        event.execute(...args, client)
      );
    } catch (e) {
      console.error(e);
    }
  }
};
