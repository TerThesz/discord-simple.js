import { CacheType, Interaction } from 'discord.js';
import CustomClient from 'client';

export default (interaction: Interaction<CacheType>, client: CustomClient) => {
  if (!interaction.isCommand()) return;

  const command = client.commands.get(interaction.commandName.toLowerCase());
  if (!command) return;

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
