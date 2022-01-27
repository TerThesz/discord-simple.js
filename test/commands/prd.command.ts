import { SimpleClient, SimpleCommand } from '../../src';

export default class PrdCommand extends SimpleCommand {
  name = 'oklahoma';
  description = 'Prints the current date and time. (not really)';

  global_cooldown = 20;

  owner_only = true;

  permissions = [
    {
      id: '933766741807476776',
      type: 'role',
      permission: true,
    },
  ];
  use_without_permission = true;

  async execute(interaction: any, client: SimpleClient) {
    await interaction.reply('cauko');

    client.user?.setActivity('cauko', { type: 'WATCHING' });
  }

  subcommands = [
    {
      name: 'subcommand',
      description: 'A subcommand',

      options: [
        {
          name: 'option',
          description: 'An option',

          type: 'string',
          required: true,

          choices: [
            {
              name: 'choice',
              value: 'value',
            },
          ],
        },
      ],
    },
  ];
}
