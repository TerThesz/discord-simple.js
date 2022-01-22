import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v9';
import { Collection } from 'discord.js';
import fs from 'fs';
import CustomClient from 'client';
import { SimpleCommand } from 'classes';

export default async (client: CustomClient, guild_id?: string) => {
  client.commands = await new Collection<string, SimpleCommand>();
  client.timestamps = await new Array<{
    user_id: string;
    command_name: string;
    timestamp: number;
  }>();

  await console.log('\n🤔 Loading commands...');

  const command_files = await fs
    .readdirSync(client.commands_folder)
    .filter((file) => file.endsWith('command.ts') || file.endsWith('.ts'));

  if (!command_files.length) return console.log('\n🙁 No commands found.');

  await command_files.forEach(async (command_file) => {
    const command =
      await new (require(`${client.commands_folder}/${command_file}`).default)();

    await command._slash_command
      .setName(command.name)
      .setDescription(command.description);

    if (command.options) {
      for (const option of command.options) {
        await handle_option(command._slash_command, option);
      }
    }

    if (command.subcommands) {
      for (const subcommand of command.subcommands) {
        await command._slash_command.addSubcommand(
          (subcommand_builder: any) => {
            subcommand_builder
              .setName(subcommand.name)
              .setDescription(subcommand.description);

            if (subcommand.options) {
              for (const option of subcommand.options) {
                handle_option(subcommand_builder, option);
              }
            }

            return subcommand_builder;
          }
        );
      }
    }

    await client.commands.set(command.name, command);
  });

  const commands = await client.commands.map((command: any) =>
    command._slash_command.toJSON()
  );

  const rest = await new REST({ version: '9' }).setToken(client.token);

  if (guild_id) {
    rest
      .put(Routes.applicationGuildCommands(client.client_id, guild_id), {
        body: commands,
      })
      .then(() =>
        console.log(
          `\n✔️ Successfully registered ${client.commands.size} guild command/-s.`
        )
      )
      .catch(console.error);

    return;
  }

  rest
    .put(Routes.applicationCommands(client.client_id), {
      body: commands,
    })
    .then(() =>
      console.log(
        `\n✔️ Successfully registered ${client.commands.size} application command/-s.`
      )
    )
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
