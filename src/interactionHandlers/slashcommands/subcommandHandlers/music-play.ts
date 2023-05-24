import { AudioPlayerStatus, createAudioPlayer, createAudioResource, entersState, getVoiceConnection, joinVoiceChannel, StreamType, VoiceConnectionStatus } from "@discordjs/voice";
import { Song } from "@myTypes/*";
import { ActionRowBuilder, ChatInputCommandInteraction, ComponentType, Guild, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { Video, YouTube } from "youtube-sr"
import { CheckOrDownloadSong } from "./utils/checkOrDownloadSong.js";

export async function ParseVideoIdOrName(interaction: ChatInputCommandInteraction<'cached'>) {

	if (!interaction.member.voice.channelId) {
		return await interaction.reply({ content: `${interaction.member.displayName} debes estar conectado a un canal de voz.` })
	}

	const videoId = interaction.options.getString('video_id')

	if (!videoId) return await interaction.reply({ content: 'Debes ingresar el nombre de un video o una id' })


	// Means it probably was autocompleted, hence we have the full file name available
	if (videoId.endsWith('.opus')) {
		await interaction.reply({ content: 'Tu video será añadido a la cola!' })
		return CreateConnectionAndPlayer({ path_to_video: videoId, id: videoId, requestedBy: interaction.user.username }, interaction)
	}

	await interaction.deferReply()

	if (isValidId(videoId)) {
		const isDownloaded = await CheckOrDownloadSong(interaction, videoId)
		if (!isDownloaded)
			return void interaction.editReply({ content: `Tu video ${videoId} no se ha podido descargar.` })

		await interaction.editReply({ content: 'Tu video ha sido añadido a la cola!' })
		return CreateConnectionAndPlayer({ path_to_video: isDownloaded, id: isDownloaded, requestedBy: interaction.user.username }, interaction)

	} else {
		// if its not a Video Id or if the file was not found we have to search for a video
		const FoundVideos = await SearchYoutubeVideo(videoId)

		if (!FoundVideos || FoundVideos.length === 0) return await interaction.editReply({ content: 'No encontré ningún video.' })

		if (FoundVideos.length === 1) {
			const videoPath = await CheckOrDownloadSong(interaction, FoundVideos[0].id!)

			if (!videoPath)
				return void interaction.editReply({ content: 'Tu video no se ha podido descargar.' })
			else {

				await interaction.editReply({ content: 'Tú video ha sido añadido a la cola!' })
				return CreateConnectionAndPlayer({
					id: videoPath,
					path_to_video: videoPath,
					requestedBy: interaction.user.username,
					duration: FoundVideos[0].durationFormatted,
					name: FoundVideos[0].title,
					uploader: FoundVideos[0].channel?.name
				}, interaction)
			}
		}

		// If there is more than one video
		const GetSelectedVideo = await VideoSelectMenu(interaction, FoundVideos)

		if (!GetSelectedVideo) return await interaction.editReply({ content: 'No seleccionaste ningún video en el tiempo dado, la interacción ha terminado.', components: [] })

		const isDownloaded = await CheckOrDownloadSong(interaction, GetSelectedVideo.id)

		if (!isDownloaded) return await interaction.editReply({ content: 'Ocurrió un error con la descarga de este video.' })

		return CreateConnectionAndPlayer({ ...GetSelectedVideo, path_to_video: isDownloaded }, interaction)
	}
}

export function isValidId(id: string) {
	return YouTube.validate(id, "VIDEO_ID")
}

export async function VideoSelectMenu(interaction: ChatInputCommandInteraction<'cached'>, videos: Video[]): Promise<Omit<Song, "path_to_video"> | null> {

	const VideoSelectMessage = await interaction.editReply({
		content: 'Selecciona uno de los videos que encontré',
		components: [
			new ActionRowBuilder<StringSelectMenuBuilder>()
				.addComponents(
					new StringSelectMenuBuilder()
						.setCustomId('video-select-menu')
						.setPlaceholder('Selecciona un video...')
						.setOptions(
							videos.map(video => {
								return new StringSelectMenuOptionBuilder()
									.setLabel(video.title ?? "untitled")
									.setDescription(`Subido por ${video.channel?.name ?? "--"} ${video.durationFormatted}`)
									// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
									.setValue(video.id!)
							})
						)
				)
		]
	})

	const SelectVideoInteraction = await VideoSelectMessage.awaitMessageComponent({
		componentType: ComponentType.StringSelect,
		time: 60_000,
		filter: (i) => {
			if (i.user.id === interaction.user.id)
				return true

			void i.reply({ content: 'Esta interacción no es tuya!', ephemeral: true })
			return false
		}
	}).catch(() => null)

	if (!SelectVideoInteraction) return null;

	await SelectVideoInteraction.update({ components: [] })
	// This is video ID

	const SelectedVideo = videos.find(video => video.id === SelectVideoInteraction.values[0])!

	return {
		id: SelectedVideo.id!,
		requestedBy: SelectVideoInteraction.user.username,
		duration: SelectedVideo.durationFormatted,
		name: SelectedVideo.title,
		uploader: SelectedVideo.channel?.name,
	}

}

export async function SearchYoutubeVideo(name: string) {
	const Videos = await YouTube.search(name, { type: 'video', limit: 20, safeSearch: false })

	if (Videos.length === 0) return null

	return Videos.filter(video => video.duration <= 1_000 * 60 * 7).slice(0, 25)
}

async function CreateConnectionAndPlayer(song: Song, interaction: ChatInputCommandInteraction<'cached'>) {

	const { guild } = interaction

	if (!guild.queue) {
		guild.queue = { songs: [], channelId: interaction.channelId }
	}

	// TODO: Check if the guild has already an audioPlayer created
	if (guild.audioPlayer) {
		// If it does, check if the audio player is playing audio
		if (guild.audioPlayer.state.status === AudioPlayerStatus.Playing) {
			// If it does, add the {videoname} to the guild queue and return.
			guild.queue.songs.push(song)
			return
		}
	}


	console.log('Connecting to the voice channel');
	const connection = await ConnectToVoice(interaction)
	console.log('Muki is connected and ready to send audio');


	// TODO: Create the resource and the audio player, and attach them to the guild's Queue object
	console.log('Creating audio player');
	guild.audioPlayer = createAudioPlayer()

	// Subscribe the player to the connection
	connection.subscribe(guild.audioPlayer)

	StartPlayback(guild, song.path_to_video)
	return
}

function StartPlayback(guild: Guild, videoname: string) {

	const resource = createAudioResource('downloads/' + videoname, { inputType: StreamType.Opus })

	guild.audioPlayer?.play(resource)

	guild.audioPlayer?.on(AudioPlayerStatus.Idle, () => {

		// Check if we are still connected to the channel, otherwise just stop all playback, empty the queue.
		const connection = getVoiceConnection(guild.id)

		// Do not handle stopping the audioPlayer here
		if (!connection) {
			return guild.queue!.songs = []
		}

		// If there is at least 1 song on queue
		if (guild.queue!.songs.length >= 1) {

			guild.audioPlayer?.play(GetNextResource(guild.queue!.songs.shift()!.path_to_video))
		}
	})
}

function GetNextResource(videoname: string) {
	return createAudioResource('downloads/' + videoname, { inputType: StreamType.Opus })
}

async function ConnectToVoice(interaction: ChatInputCommandInteraction<'cached'>) {
	// TODO: Check for a voice connection

	const connection = getVoiceConnection(interaction.guildId)

	if (connection) return connection

	// TODO: If there is not a voice connection, we need to create one
	const newConnection = joinVoiceChannel({
		adapterCreator: interaction.guild.voiceAdapterCreator,
		channelId: interaction.member.voice.channelId!,
		guildId: interaction.guildId
	})

	// Connect the bot to the channel, wait for it to be ready to transmit audio, then continue
	await entersState(newConnection, VoiceConnectionStatus.Ready, 20_000)

	// If we connected succesfully and are ready to transmit audio, then resolve with the voice connection
	return newConnection
}