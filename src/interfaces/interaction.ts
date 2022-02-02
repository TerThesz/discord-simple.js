import { CommandInteraction, GuildMember, User } from 'discord.js';

interface SimpleInteraction extends CommandInteraction {
  sender: User;
  target: User;

  sender_member: GuildMember | undefined;
  target_member: GuildMember | undefined;
}

export default SimpleInteraction;
