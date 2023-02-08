import { ActionRowBuilder, ChatInputCommandInteraction, ComponentType, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import { YouTube } from "youtube-sr"
import { CheckOrDownloadSong } from "./utils/checkOrDownloadSong";
import { readdir } from "fs/promises"
export async function ParseVideoIdOrName(interaction: ChatInputCommandInteraction<'cached'>) {

	if (!interaction.member.voice.channelId) {
		return await interaction.reply({ content: `${interaction.member.displayName} debes estar conectado a un canal de voz.` })
	}

	const videoId = interaction.options.getString('video_id')

	if (!videoId) return await interaction.reply({ content: 'Debes ingresar el nombre de un video o una id' })


	// Means it probably was autocompleted, hence we have the full file name available
	if (videoId.endsWith('.opus')) {
		return interaction.client.emit('music-play', interaction, videoId)
	}

	await interaction.deferReply()

	if (isValidId(videoId)) {
		return void await EmitPlay(interaction, videoId)


	} else {
		// if its not a Video Id or if the file was not found we have to search for a video
		const FoundVideos = await SearchYoutubeVideo(videoId)

		if (!FoundVideos) return await interaction.editReply({ content: 'No encontré ningún video.' })

		if (FoundVideos.length === 1) {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			return void await EmitPlay(interaction, FoundVideos[0].id!)
		}

		// If there is more than one video
		const VideoSelectMessage = await interaction.editReply({
			content: 'Selecciona uno de los videos que encontré',
			components: [
				new ActionRowBuilder<StringSelectMenuBuilder>()
					.addComponents(
						new StringSelectMenuBuilder()
							.setCustomId('video-select-menu')
							.setPlaceholder('Selecciona un video...')
							.setOptions(
								FoundVideos.map(video => {
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

		if (!SelectVideoInteraction) return await interaction.editReply({ content: 'La interacción ha terminado.', components: [] })

		await SelectVideoInteraction.update({ components: [] })
		// This is video ID
		const SelectedVideoId = SelectVideoInteraction.values[0]
		return void await EmitPlay(interaction, SelectedVideoId)
	}
}

async function EmitPlay(interaction: ChatInputCommandInteraction<"cached">, videoId: string): Promise<unknown> {
	const FileId = await CheckOrDownloadSong(interaction, videoId)

	if (!FileId) {
		return await interaction.editReply({ content: 'Ocurrió un error desconocido.' })
	}

	const filename = await readdir("downloads").then(files => files.find(file => file.includes(FileId)))

	return interaction.client.emit('music-play', interaction, filename)
}

function isValidId(id: string) {
	return YouTube.validate(id, "VIDEO_ID")
}

async function SearchYoutubeVideo(name: string) {
	const Videos = await YouTube.search(name, { type: 'video', limit: 20, safeSearch: false })

	if (Videos.length === 0) return null
	return Videos.slice(0, 25)
}
