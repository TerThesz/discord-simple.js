import { CacheType, Interaction } from 'discord.js';
import CustomClient from 'client';

export default (interaction: Interaction<CacheType>, client: CustomClient) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName.toLowerCase());
  if (!command) return;

  if (command.cooldown) {
    const timestamp = client.timestamps.find(
      (cooldown) => cooldown.user_id === interaction.user.id
    );

    if (timestamp) {
      interaction.reply({
        content: `⏳ You need to wait ${Math.floor(
          command.cooldown - (new Date().getTime() - timestamp.timestamp) / 1000
        )} seconds before using this command again.`,
        ephemeral: true,
      });

      return;
    }

    client.timestamps.push({
      user_id: interaction.user.id,
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
    }, command.cooldown * 1000);
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
