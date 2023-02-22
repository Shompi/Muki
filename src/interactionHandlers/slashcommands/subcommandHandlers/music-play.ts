import { AudioPlayerStatus, createAudioPlayer, createAudioResource, entersState, getVoiceConnection, joinVoiceChannel, StreamType, VoiceConnectionStatus } from "@discordjs/voice";
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
		return CreateConnectionAndPlayer(videoId, interaction)
	}

	await interaction.deferReply()

	if (isValidId(videoId)) {
		const isDownloaded = await CheckOrDownloadSong(interaction, videoId)
		if (!isDownloaded)
			return void interaction.editReply({ content: `Tu video ${videoId} no se ha podido descargar.` })

		await interaction.editReply({ content: 'Tu video ha sido añadido a la cola!' })
		return CreateConnectionAndPlayer(isDownloaded, interaction)

	} else {
		// if its not a Video Id or if the file was not found we have to search for a video
		const FoundVideos = await SearchYoutubeVideo(videoId)

		if (!FoundVideos || FoundVideos.length === 0) return await interaction.editReply({ content: 'No encontré ningún video.' })

		if (FoundVideos.length === 1) {
			const isDownloaded = await CheckOrDownloadSong(interaction, FoundVideos[0].id!)

			if (!isDownloaded)
				return void interaction.editReply({ content: 'Tu video no se ha podido descargar.' })
			else {

				await interaction.editReply({ content: 'Tú video ha sido añadido a la cola!' })
				return CreateConnectionAndPlayer(isDownloaded, interaction)
			}
		}

		// If there is more than one video
		const GetSelectedVideo = await VideoSelectMenu(interaction, FoundVideos)

		if (!GetSelectedVideo) return await interaction.editReply({ content: 'No seleccionaste ningún video en el tiempo dado, la interacción ha terminado.', components: [] })

		const isDownloaded = await CheckOrDownloadSong(interaction, GetSelectedVideo)

		if (!isDownloaded) return await interaction.editReply({ content: 'Ocurrió un error con la descarga de este video.' })

		return CreateConnectionAndPlayer(isDownloaded, interaction)
	}
}

function isValidId(id: string) {
	return YouTube.validate(id, "VIDEO_ID")
}

async function VideoSelectMenu(interaction: ChatInputCommandInteraction<'cached'>, videos: Video[]) {

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
	return SelectVideoInteraction.values[0]

}

async function SearchYoutubeVideo(name: string) {
	const Videos = await YouTube.search(name, { type: 'video', limit: 20, safeSearch: false })

	if (Videos.length === 0) return null

	return Videos.filter(video => video.duration <= 1_000 * 60 * 7).slice(0, 25)
}

async function CreateConnectionAndPlayer(videoname: string, interaction: ChatInputCommandInteraction<'cached'>) {

	const { guild } = interaction

	if (!guild.queue) {
		guild.queue = { songs: [], channelId: interaction.channelId }
	}

	// TODO: Check if the guild has already an audioPlayer created
	if (guild.audioPlayer) {
		// If it does, check if the audio player is playing audio
		if (guild.audioPlayer.state.status === AudioPlayerStatus.Playing) {
			// If it does, add the {videoname} to the guild queue and return.
			guild.queue.songs.push(videoname)
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

	StartPlayback(guild, videoname)
	return
}

function StartPlayback(guild: Guild, videoname: string) {

	const resource = createAudioResource('downloads/' + videoname, { inputType: StreamType.Opus })

	guild.audioPlayer?.play(resource)

	guild.audioPlayer?.on(AudioPlayerStatus.Idle, () => {

		// If there is at least 1 song on queue
		if (guild.queue!.songs.length >= 1) {

			guild.audioPlayer?.play(GetNextResource(guild.queue!.songs.shift()!))
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