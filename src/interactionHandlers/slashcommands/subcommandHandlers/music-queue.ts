import { ChatInputCommandInteraction, codeBlock, Colors, EmbedBuilder } from "discord.js";

export async function ShowQueue(interaction: ChatInputCommandInteraction<'cached'>) {

	const { guild } = interaction

	if (!guild.queue || guild.queue?.songs.length === 0) {
		return await interaction.reply({ content: 'No hay canciones en la cola.' })
	}

	const Songs = guild.queue.songs.map((song, index) => `${index + 1}- ${song}`).join('\n')

	const QueueEmbed = new EmbedBuilder()
		.setTitle('Cola de canciones')
		.setDescription(codeBlock(Songs))
		.setColor(Colors.Blue)

	return await interaction.reply({ embeds: [QueueEmbed] })
}