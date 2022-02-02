import { Intents } from 'discord.js';
import { SimpleClient, SimpleCommand } from '../../src';
import { SimpleInteraction } from '../../src/interfaces';

export default class PrdCommand extends SimpleCommand {
  name = 'jan1o';
  description = 'Prints the current date and time. (not really)';

  permissions = ['ADMINISTRATOR'];

  async execute(interaction: SimpleInteraction, client: SimpleClient): Promise<void> {
    interaction.reply('Hello World');
  }
}
