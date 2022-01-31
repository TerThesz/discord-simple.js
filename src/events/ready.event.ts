import command_handler from '../handlers/command_handler';
import event_handler from '../handlers/event_handler';
import { SimpleEvent } from 'interfaces';

export default class ReadyEvent implements SimpleEvent {
  name = 'ready';
  once = true;

  async execute(client: any) {
    if (client.set_roles_on_join && !client.join_roles) throw new Error('🚫 No join roles provided!');

    if (client.welcomes_and_goodbyes && !client.welcome_channel_id) throw new Error('🚫 No welcome channel id provided!');

    if (client._load_commands)
      command_handler(
        client,
        client.guild_id === undefined ? undefined : client.development_mode || client.guild_only ? client.guild_id : undefined
      );

    if (client._load_events) event_handler(client);
  }
}
