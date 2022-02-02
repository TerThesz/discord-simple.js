import command_handler from '../handlers/command_handler';
import { SimpleEvent } from 'interfaces';
import { SimpleClient } from 'index';
import interaction_handler from '../handlers/interaction_handler';
import { Guild } from 'discord.js';

export default class ReadyEvent implements SimpleEvent {
  name = 'ready';
  once = true;

  async execute(client: SimpleClient) {
    if (client.set_roles_on_join && !client.join_roles) throw new Error('🚫 No join roles provided!');

    if (client.welcomes_and_goodbyes && !client.welcome_channel_id) throw new Error('🚫 No welcome channel id provided!');

    if (client._load_commands)
      command_handler(
        client,
        client.guild_id === undefined ? undefined : client.development_mode || client.guild_only ? client.guild_id : undefined
      );

    if (client.client_presence) {
      if (client.client_presence.status) client.user?.setStatus(client.client_presence.status);

      if (client.client_presence.activities) {
        if (client.client_presence.activities_interval) {
          setInterval(() => {
            const activity = (client.client_presence as any).activities[
              Math.floor(Math.random() * (client.client_presence as any).activities.length)
            ];
            client.user?.setActivity(activity.content, { type: activity.type });
          }, client.client_presence.activities_interval * 1000);
        } else {
          const activity = client.client_presence.activities[Math.floor(Math.random() * client.client_presence.activities.length)];
          client.user?.setActivity(activity.content, { type: activity.type });
        }
      }
    }

    client.on('interactionCreate', (interaction: any) => {
      if (client._load_commands) interaction_handler(interaction, client);
    });

    client.once('error', (error: any) => console.error(`😥 client's WebSocket encountered a connection error: ${error}`));

    client.once('disconnect', () => console.log(`⛔️ the WebSocket has closed and will no longer attempt to reconnect`));

    client.on('guildCreate', (guild: Guild) => {
      if (client.dashboard?.enabled ?? false) client.driver.create_guild_entry(guild.id);
    });
    client.on('guildDelete', (guild: Guild) => {
      if (client.dashboard?.enabled ?? false) client.driver.delete_guild_entry(guild.id);
    });
  }
}
