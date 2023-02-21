import { joinVoiceChannel, getVoiceConnection, createAudioPlayer, createAudioResource, StreamType, AudioPlayerStatus, entersState, VoiceConnectionStatus } from "@discordjs/voice"
import { ChatInputCommandInteraction, TextChannel } from "discord.js"
import { readdir } from "node:fs/promises"

export default {
	name: "music-play",
	once: false,
	async execute(interaction: ChatInputCommandInteraction<"cached">, path_to_song_or_id?: string) {



		if (!path_to_song_or_id) return
		const { guild } = interaction

		const files = await readdir('downloads')
		const videoname = files.find(video => video.includes(path_to_song_or_id) && video.endsWith('.opus'))

		if (!videoname) return

		if (!guild.queue) {
			guild.queue = { songs: [], channelId: interaction.channelId }
		}

		if (guild.audioPlayer && guild.audioPlayer.state.status === AudioPlayerStatus.Playing) {
			guild.queue?.songs.push(videoname)
			return await interaction.reply({ content: 'Tu canción fue añadida a la cola.' })
		}

		if (!interaction.replied)
			void await interaction.reply({ content: `Reproduciendo: ${path_to_song_or_id}` })
		else {
			const interactionChannel = interaction.client.channels.cache.get(guild.queue.channelId) as TextChannel
			void await interactionChannel.send({ content: `Reproduciendo: ${path_to_song_or_id}}` })
		}

		try {
			await playAudioOnConnection(interaction, path_to_song_or_id)

		} catch (e) {
			console.log(e);
			console.log("La conexión al canal de voz tomó demasiado tiempo en entrar en el estado Ready.");
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

async function playAudioOnConnection(interaction: ChatInputCommandInteraction<'cached'>, path_to_song: string) {
	const { guild } = interaction
	// Check if there is already a voice connection
	const connection = createVoiceConnection(interaction)

	// Play the song, at this point the song should be already downloaded
	const resource = createAudioResource("downloads/" + path_to_song, { inputType: StreamType.Opus })

	// Create an audio player if there is not one

	if (!guild.audioPlayer) {
		guild.audioPlayer = createAudioPlayer()
	}

	// Subscribe the audio player 
	connection.subscribe(guild.audioPlayer)

	// Check if the connection is ready
	if (connection.state.status !== VoiceConnectionStatus.Ready) {
		await entersState(connection, VoiceConnectionStatus.Ready, 20_000)
	}

	// Start playing the resource once the connection enters the ready state
	guild.audioPlayer.play(resource)

	connection.on(VoiceConnectionStatus.Disconnected, () => {
		connection.destroy()
		guild.audioPlayer?.stop(true)
		guild.audioPlayer = undefined
		guild.queue = undefined
	})

	guild.audioPlayer?.on(AudioPlayerStatus.Idle, () => {

		if (guild.queue && guild.queue.songs.length >= 1) {

			return void interaction.client.emit('music-play', interaction, guild.queue?.songs.shift())
		}

		if (guild.queue && guild.queue.songs.length === 0) {

			connection.destroy()
			guild.audioPlayer?.stop()
			guild.audioPlayer = undefined
			guild.queue = undefined
			return
		}
	})
}