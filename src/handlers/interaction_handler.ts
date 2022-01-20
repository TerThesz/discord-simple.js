import { CacheType, Interaction } from 'discord.js';
import CustomClient from 'client';

export default (interaction: Interaction<CacheType>, client: CustomClient) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName.toLowerCase());
  if (!command) return;

  if (command.owner_only && interaction.user.id !== interaction.guild?.ownerId)
    return interaction.reply({
      content: '🚫 This command is only for the server owner.',
      ephemeral: true,
    });

  if (command.global_cooldown || command.cooldown) {
    const cooldown = (command.global_cooldown || command.cooldown) as number;

    const timestamp = client.timestamps.find(
      (cooldown) =>
        cooldown.user_id === '*' || cooldown.user_id === interaction.user.id
    );

    if (timestamp) {
      interaction.reply(
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

    client.timestamps.push({
      user_id: command.global_cooldown ? '*' : interaction.user.id,
      command_name: interaction.commandName.toLowerCase(),
      timestamp: new Date().getTime(),
    });

    setTimeout(() => {
      client.timestamps.splice(
        client.timestamps.findIndex(
          (cooldown) => cooldown.user_id === interaction.user.id
        ),
        1
      );
    }, cooldown * 1000);
  }

  try {
    command.execute(interaction, client);
  } catch (error) {
    console.error(error);
    interaction.reply({
      content: 'There was an error while executing this command!',
      ephemeral: true,
    });
  }
};
