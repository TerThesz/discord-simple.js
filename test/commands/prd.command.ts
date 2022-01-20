import { CommandInteraction } from 'discord.js';
import { SimpleClient, SimpleCommand } from '../../src';

export default class PrdCommand extends SimpleCommand {
  name = 'prd';
  description = 'Prints the current date and time. (not really)';

  global_cooldown = 20;

  async execute(interaction: CommandInteraction, client: SimpleClient) {
    await interaction.reply('cauko');

    client.user?.setActivity('cauko', { type: 'WATCHING' });
  }
}
