import { GuildMember, PartialGuildMember, TextChannel } from 'discord.js';
import { SimpleClient } from 'index';
import { SimpleEvent } from '../interfaces';
import { parse_locale } from '../utils';

export default class MemberRemoveEvent implements SimpleEvent {
  name = 'guildMemberRemove';
  once = false;

  async execute(client: SimpleClient, member: GuildMember | PartialGuildMember): Promise<void> {
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
          client.locale?.goodbye_message ||
            (client.driver.get_entry({
              guild_id: member.guild.id,
              client,
              option: {
                key: 'locale.goodbye_message',
              },
            }) as string) ||
            '😥 %user% just left us.',
          {
            member,
            guild: member.guild,
          }
        )
      );
    }
  }
}
