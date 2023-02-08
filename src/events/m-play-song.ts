import { joinVoiceChannel, getVoiceConnection, createAudioPlayer, createAudioResource, StreamType, AudioPlayerStatus } from "@discordjs/voice"
import { ChatInputCommandInteraction } from "discord.js"


export default {
	name: "music-play",
	once: false,
	async execute(interaction: ChatInputCommandInteraction<"cached">, path_to_song: string) {

		const { channel, guild } = interaction

		if (!guild.queue) {
			guild.queue = { songs: [] }
		}

		if (guild.audioPlayer && guild.audioPlayer.state.status === AudioPlayerStatus.Playing) {
			guild.queue?.songs.push(path_to_song)
			return await interaction.reply({ content: 'Tu canción fue añadida a la cola.' })
		}

		// Check if there is already a voice connection
		const connection = createVoiceConnection(interaction)

		// Play the song, at this point the song should be already downloaded
		const resource = createAudioResource("downloads/" + path_to_song, { inputType: StreamType.Opus })

		// Create an audio player

		guild.audioPlayer = createAudioPlayer()

		guild.audioPlayer.play(resource)

		// Subscribe the audio player 
		connection.subscribe(guild.audioPlayer)

		guild.audioPlayer.on(AudioPlayerStatus.Idle, () => {

			if (guild.queue && guild.queue.songs.length === 0) {
				console.log("No hay mas canciones en la cola, desconectando.");
				void channel?.send({ content: 'No hay más canciones en la cola.' })
				connection.destroy()
			}

			if (guild.queue && guild.queue.songs.length >= 1) {

				console.log("Pasando a la siguiente canción...");

				interaction.client.emit('music-play', interaction, guild.queue?.songs.shift())
			}
		})

		if (interaction.replied) {
			return await channel?.send({ content: `Reproduciendo: ${path_to_song}` })
		}

		if (interaction.deferred) {
			return await interaction.editReply({ content: `Reproduciendo: ${path_to_song}` })
		}

		if (interaction.isRepliable()) {
			return interaction.reply({ content: `Reproduciendo: ${path_to_song}` })
		}

	}
}

function createVoiceConnection(interaction: ChatInputCommandInteraction<"cached">) {

	let connection = getVoiceConnection(interaction.guildId)

	if (!connection) {

		// Create the voice connection
		connection = joinVoiceChannel({
			adapterCreator: interaction.guild.voiceAdapterCreator,
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			channelId: interaction.member.voice.channelId!,
			guildId: interaction.guildId,
			selfDeaf: true
		})
	}
	return connection
}