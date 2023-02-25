import { ChatInputCommandInteraction, codeBlock, Colors, EmbedBuilder } from "discord.js";

export async function ShowQueue(interaction: ChatInputCommandInteraction<'cached'>) {

	const { guild } = interaction

	if (!guild.queue || guild.queue?.songs.length === 0) {
		return await interaction.reply({ content: 'No hay canciones en la cola.' })
	}

	const SongsOnQueue = guild.queue.songs.map((song, index) => {
		if (song.name) {
			/** Significa que la canción fue encolada por un menú de selección, por lo que tenemos otras propiedades disponibles */
			return `${index + 1} - ${song.name} -> ${song.requestedBy}`
		} else {
			return `${index + 1} - ${song.path_to_video} -> ${song.requestedBy}`
		}
	}).join('\n')

	const SongsToDisplay = SongsOnQueue.slice(0, 10) // Solo mostrar las primeras 10 canciones para no excede limites.

	const QueueEmbed = new EmbedBuilder()
		.setTitle('Cola de canciones')
		.setDescription(codeBlock(SongsOnQueue))
		.setColor(Colors.Blue)

	return await interaction.reply({ embeds: [QueueEmbed], content: '¡Estas son las siguientes canciones!' })
}