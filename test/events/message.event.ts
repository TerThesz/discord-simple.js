import { Interaction, Message, MessageInteraction } from 'discord.js';
import { SimpleClient, SimpleEvent } from '../../src';

export default class MessageEvent implements SimpleEvent {
  name = 'message';
  once = false;

  execute(client: SimpleClient, message: Message): void {
    if (message.author.bot || message.guild?.ownerId === message.author.id) return;
    /* 
    message.reply('Tvoja mama.'); */
  }
}
