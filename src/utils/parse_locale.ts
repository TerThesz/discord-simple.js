import { Guild, GuildMember, PartialGuildMember } from 'discord.js';

export default (
  locale: string,
  args: {
    member?: GuildMember | PartialGuildMember;
    guild?: Guild;
  }
) => {
  return locale
    .replace('%user%', `<@${args.member?.id}>`)
    .replace('%user_id%', args.member?.id || 'undefined')
    .replace('%user_name%', args.member?.displayName || 'undefined')
    .replace('%guild%', args.guild?.name || 'undefined')
    .replace('%guild_id%', args.guild?.id || 'undefined');
};
