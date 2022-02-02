import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { Collection } from 'discord.js';
import CustomClient from '../client';
import { SimpleCommand } from '../classes';
import { resolve } from 'path';
import { scan_files } from '../utils';

export default async (client: CustomClient, guild_id?: string) => {
  client.commands = new Collection<string, SimpleCommand>();
  client.timestamps = new Array<{
    user_id: string;
    command_name: string;
    timestamp: number;
  }>();

  console.log('\n🤔 Loading commands...');

  const command_files = (await scan_files(resolve(client.commands_folder + '/**/*'))).filter(
    (file) => file.endsWith('command.ts') || file.endsWith('.ts')
  );

  if (!command_files.length) return console.log('\n🙁 No commands found.');

  command_files.forEach((command_file) => {
    let command = require(resolve(client.commands_folder + '/' + command_file.replace(client.commands_folder, '')));
    if (command.default) command = command.default;
    command = new command();

    command._slash_command.setName(command.name).setDescription(command.description);

    if (command.options) {
      for (const option of command.options) {
        handle_option(command._slash_command, option);
      }
    }

    if (command.subcommands) {
      for (const subcommand of command.subcommands) {
        command._slash_command.addSubcommand((subcommand_builder: any) => {
          subcommand_builder.setName(subcommand.name).setDescription(subcommand.description);

          if (subcommand.options) {
            for (const option of subcommand.options) {
              handle_option(subcommand_builder, option);
            }
          }

          return subcommand_builder;
        });
      }
    }

    client.commands.set(command.name, command);
  });

  const commands = client.commands.map((command: any) => command._slash_command.toJSON());

  const rest = new REST({ version: '9' }).setToken(client.token);

  if (guild_id) {
    rest
      .put(Routes.applicationGuildCommands(client.client_id, guild_id), {
        body: commands,
      })
      .then(() => console.log(`\n✔️ Successfully registered ${client.commands.size} guild command/-s.`))
      .catch(console.error);

    return;
  }

  rest
    .put(Routes.applicationCommands(client.client_id), {
      body: commands,
    })
    .then(() => console.log(`\n✔️ Successfully registered ${client.commands.size} application command/-s.`))
    .catch(console.error);
};

function handle_option(command: any, option: any) {
  command[
    'add' +
      option.type
        .split('')
        .map((char: string, index: number) => {
          if (index === 0) return char.toUpperCase();
          return char;
        })
        .join('') +
      'Option'
  ]((option_thingy: any) => {
    option_thingy
      .setName(option.name)
      .setDescription(option.description)
      .setRequired(option.required || false);

    if (option.choices) {
      option.choices.forEach((choice: any) => {
        option_thingy.addChoice(choice.name, choice.value);
      });
    }

    return option_thingy;
  });
}
