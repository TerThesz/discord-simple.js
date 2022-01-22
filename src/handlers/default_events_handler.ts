import CustomClient from 'client';
import { GuildMember } from 'discord.js';
import command_handler from './command_handler';
import event_handler from './event_handler';
import interaction_handler from './interaction_handler';

// I'll maybe add a handler for these later.

/**
 * A function that handles default package events.
 *
 * @private
 *
 * @param client {CustomClient} The client itself
 */
export default (client: CustomClient) => {
  client.once('ready', () => {
    if (client.set_roles_on_join) {
      if (!client.join_roles) throw new Error('🚫 No join roles provided!');

      client.on('guildMemberAdd', (member: GuildMember) => {
        try {
          (client.join_roles as Array<string>).forEach((role) => {
            member.roles.add(role);
          });
        } catch (error) {
          console.log(error);

          console.log(
            "\n\nThe bot's role probably has a lover permission level than the role you want to add to a user or it is placed lower in the role hierarchy."
          );
        }
      });
    }

    if (client._load_commands)
      command_handler(
        client,
        client.guild_id === undefined
          ? undefined
          : client.development_mode || client.guild_only
          ? client.guild_id
          : undefined
      );

    if (client._load_events) event_handler(client);
  });

  client.on('interactionCreate', (interaction) => {
    if (client._load_commands) interaction_handler(interaction, client);
  });

  client.once('error', (error) => {
    console.error(
      `😥 client's WebSocket encountered a connection error: ${error}`
    );
  });

  client.once('disconnect', () => {
    console.log(
      `⛔️ the WebSocket has closed and will no longer attempt to reconnect`
    );
  });
};
