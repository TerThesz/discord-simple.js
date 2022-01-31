import { Message } from 'discord.js';
import { SimpleClient } from 'index';
import SimpleCache from '../lib/cache';
import { SimpleEvent } from '../interfaces';

export default class MessageCreateEvent implements SimpleEvent {
  name = 'messageCreate';
  once = false;

  async execute(client: SimpleClient, message: Message): Promise<void> {
    if (message.author.bot || !message.guild) return;
    if (message.member?.id === message.guild?.ownerId || message.member?.permissions.has('ADMINISTRATOR')) return;
    if (message.guild?.invites.resolve(message.content)) return;

    if (
      !client.anti_server_advertising &&
      (!(client.dashboard?.enabled ?? false) ||
        !client.driver.get_entry({
          guild_id: message.guild?.id || '',
          client,
          option: {
            key: 'anti_server_advertising',
          },
        }))
    )
      return;

    if (
      message.content.match(
        client.anti_server_advertising_regex || /(https?:\/\/)?(www.)?(discord.(gg|io|me|li)|discordapp.com\/invite)\/[^\s/]+?(?=\b)/
      )
    ) {
      message.channel.send('🚫 Please do not advertise servers!');
      message.delete();
    }
  }
}
