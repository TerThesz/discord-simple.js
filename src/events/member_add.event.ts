import { GuildMember, TextChannel } from 'discord.js';
import { SimpleClient } from 'index';
import { SimpleEvent } from '../interfaces';
import { parse_locale } from '../utils';

export default class MemberAddEvent implements SimpleEvent {
  name = 'guildMemberAdd';
  once = false;

  async execute(client: SimpleClient, member: GuildMember): Promise<void> {
    if (
      client.join_roles ||
      ((client.dashboard?.enabled ?? false) &&
        client.driver.get_entry({
          guild_id: member.guild?.id || '',
          client,
          option: {
            key: 'join_roles',
          },
        }))
    ) {
      try {
        (client.join_roles as Array<string>).forEach((role) => {
          member.roles.add(role);
        });

        if (client.dashboard?.enabled ?? false) {
          (
            client.driver.get_entry({
              guild_id: member.guild?.id || '',
              client,

              option: {
                key: 'join_roles',
              },
            }) || ''
          )
            .split(',')
            .forEach((role: string) => {
              member.roles.add(role);
            });
        }
      } catch (error) {
        console.log(error);

        console.log(
          "\n\nThe bot's role probably has a lover permission level than the role you want to add to a user or it is placed lower in the role hierarchy."
        );
      }
    }

    if (
      client.welcomes_and_goodbyes ||
      ((client.dashboard?.enabled ?? false) &&
        client.driver.get_entry({
          guild_id: member.guild?.id || '',
          client,
          option: {
            key: 'welcomes_and_goodbyes',
          },
        }))
    ) {
      const channel = client.channels.cache.get(client.welcome_channel_id as string) as TextChannel;

      if (!channel) throw new Error('🚫 Welcome channel could not be found.');
      channel.send(
        parse_locale(
          client.locale?.welcome_message ||
            (client.driver.get_entry({
              guild_id: member.guild.id,
              client,
              option: {
                key: 'locale.welcome_message',
              },
            }) as string) ||
            '👋 Welcome to **%guild%**, %user%!',
          {
            member,
            guild: member.guild,
          }
        )
      );
    }
  }
}
