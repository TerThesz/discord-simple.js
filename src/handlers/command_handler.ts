import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";
import { Collection } from "discord.js";
import fs from "fs";
import SimpleClient from "simple_client";
import { CommandType } from "types";

export default (client: SimpleClient) => {
  client.commands = new Collection();

  console.log("🤔 Loading commands...\n");

  const command_files = fs
    .readdirSync(client.commands_folder)
    .filter((file) => file.endsWith("command.ts") || file.endsWith(".ts"));

  if (!command_files.length) return console.log("🙁 No commands found.");

  for (const command_file of command_files) {
    const command =
      new (require(`${client.commands_folder}/${command_file}`).default)();

    command.slash_command = new SlashCommandBuilder()
      .setName(command.name)
      .setDescription(command.description);

    handle_options(command);

    // FIXME: this wont work for some reason
/*     if (command.subcommands) {
      for (const subcommand of command.subcommands) {
        command.slash_command.addSubcommand((sub_command_object: any) => {
          sub_command_object
            .setName(subcommand.name)
            .setDescription(subcommand.description);

          handle_options(subcommand);

          return sub_command_object;
        });

        console.log(
          `    -> Loaded subcommand ${command.name}/${subcommand.name}`
        );
      }
    } */

    console.log(`  👍️ Loaded command: ${command.name}\n`);
    client.commands.set(command.name, command);
  }

  const commands = client.commands.map((command: any) =>
    command.slash_command.toJSON()
  );

  const rest = new REST({ version: "9" }).setToken(client.token);

  // TODO: network-wide commands
  rest
    .put(
      Routes.applicationGuildCommands(client.client_id, "753281898226122912"),
      {
        body: commands,
      }
    )
    .then(() => console.log("✔️ Successfully registered application commands."))
    .catch(console.error);
};

function handle_options(command: any) {
  if (command.options) {
    for (const option of command.options) {
      command.slash_command[
        "add" +
          option.type
            .split("")
            .map((char: string, index: number) => {
              if (index === 0) return char.toUpperCase();
              return char;
            })
            .join("") +
          "Option"
      ]((option_thingy: any) => {
        option_thingy
          .setName(option.name)
          .setDescription(option.description)
          .setRequired(option.required || false);

        if (option.choices) {
          for (const choice of option.choices) {
            option_thingy.addChoice(choice.name, choice.value);
          }
        }

        return option_thingy;
      });
    }
  }
}
