import { CacheType, GuildMember, Interaction } from 'discord.js';
import CustomClient from 'client';
import { SimpleInteraction } from 'interfaces';

export default async (interaction: Interaction<CacheType>, client: CustomClient) => {
  if (!interaction.isCommand()) return;

  const command = await client.commands.get(interaction.commandName.toLowerCase());
  if (!command) return;

  const simple_interaction = interaction as SimpleInteraction;
  simple_interaction.sender = interaction.user;
  simple_interaction.target = interaction.user;

  simple_interaction.sender_member = interaction.guild?.members.cache.get(simple_interaction.sender.id);
  simple_interaction.target_member = interaction.guild?.members.cache.get(simple_interaction.target.id);

  if (command.owner_only && interaction.user.id !== interaction.guild?.ownerId) {
    interaction.reply({
      content: '🚫 This command is only for the server owner.',
      ephemeral: true,
    });

    return;
  }

  if (command.permissions) {
    const can_continue = client.check_perms(simple_interaction.sender_member, command.permissions);

    if (!can_continue)
      return interaction.reply({
        content: '🚫 You do not have the required permissions to use this command.',
        ephemeral: true,
      });
  }

  if ((command.global_cooldown || command.cooldown) && interaction.user.id !== interaction.guild?.ownerId) {
    const cooldown = (await (command.global_cooldown || command.cooldown)) as number;

    const timestamp = await client.timestamps.find((cooldown) => cooldown.user_id === '*' || cooldown.user_id === interaction.user.id);

    if (timestamp) {
      await interaction.reply(
        timestamp.user_id === '*'
          ? `🌏️⏳ Global Cooldown: You need to wait ${Math.floor(
              cooldown - (new Date().getTime() - timestamp.timestamp) / 1000
            )} seconds before using this command.`
          : {
              content: `⏳ Cooldown: You need to wait ${Math.floor(
                cooldown - (new Date().getTime() - timestamp.timestamp) / 1000
              )} seconds before using this command again.`,
              ephemeral: true,
            }
      );

      return;
    }

    await client.timestamps.push({
      user_id: command.global_cooldown ? '*' : interaction.user.id,
      command_name: interaction.commandName.toLowerCase(),
      timestamp: new Date().getTime(),
    });

    await setTimeout(() => {
      client.timestamps.splice(
        client.timestamps.findIndex((cooldown) => cooldown.user_id === interaction.user.id),
        1
      );
    }, cooldown * 1000);
  }

  try {
    await command.execute(simple_interaction, client);
  } catch (error) {
    console.error(error);
    interaction.reply({
      content: 'There was an error while executing this command!',
      ephemeral: true,
    });
  }
};
