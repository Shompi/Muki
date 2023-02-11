import { ChatInputCommandInteraction } from "discord.js";

export async function SkipCurrentSong(interaction: ChatInputCommandInteraction) {

	const { guild } = interaction
	// Chequear que haya algo reproduciendose
	if (!guild?.audioPlayer) {
		return await interaction.reply({ content: 'No hay nada reproduciendose.' })
	}

	// Chequear si hay una cancion en la cola
	if (!guild.queue) {
		guild.queue = { songs: [] }
	}

	if (guild.queue.songs.length === 0) {
		return await interaction.reply({ content: 'No hay más canciones en la cola.' })
	}

	// Si hay una canción en la cola, debemos detener la reproducción de la cancion actual
	// esto hará que el audio player entre en el estado "idle" gatillando que la reproducción de la siguiente canción.
	guild.audioPlayer.stop(true)

	return await interaction.reply({ content: '⏩ Saltando canción...' })
}