import { SlashCommandTemplate } from "../../types/index.ts";
import { APIApplicationCommandOptionChoice, SlashCommandBuilder } from "discord.js";
import { PauseOrUnpauseSong } from "./subcommandHandlers/music-pause.ts";
import { ParseVideoIdOrName } from "./subcommandHandlers/music-play.ts";
import { SkipCurrentSong } from "./subcommandHandlers/music-skip.ts";
import { ShowQueue } from "./subcommandHandlers/music-queue.ts";
import { StopPlayback } from "./subcommandHandlers/music-stop.ts";
import { DownloadSong } from "./subcommandHandlers/music-download.ts";

const formatChoices: APIApplicationCommandOptionChoice<string>[] = [
	{
		name: "mp3",
		value: 'mp3',
	},
	{
		name: "OPUS",
		value: "opus",
	},
]

const qualityChoices: APIApplicationCommandOptionChoice<string>[] = [
	{
		name: '128kbps',
		value: '128K',
	},
	{
		name: '192kbps',
		value: '192K',
	},
	{
		name: '256kbps',
		value: '256K',
	},
	{
		name: '320kbps',
		value: '320K'
	}
]

const command: SlashCommandTemplate = {
	data: new SlashCommandBuilder()
		.setName('music')
		.setDescription('Comandos de musica')
		.addSubcommand(play =>
			play.setName('play')
				.setDescription('Reproduce una canción')
				.addStringOption(input =>
					input.setName('video_id')
						.setDescription('ID del video')
						.setAutocomplete(true)
				)
		)
		.addSubcommand(pause =>
			pause.setName('pause')
				.setDescription('Pausa temporalmente la reproducción de audio.')
		)
		.addSubcommand(stop =>
			stop.setName('stop')
				.setDescription('Detiene la reproducción de música, desconecta al bot')
		)
		.addSubcommand(next =>
			next.setName('next')
				.setDescription('Salta a la siguiente canción')
		)
		.addSubcommand(queue =>
			queue.setName('queue')
				.setDescription('Muestra la cola de canciones')
		)
		.addSubcommand(download =>
			download.setName('download')
				.setDescription('Descarga el audio del video')
				.addStringOption(videoId =>
					videoId.setName('video')
						.setDescription('Puede ser un VideoID, Enlace de YouTube, o el nombre de un video')
						.setRequired(true)
				)
				.addStringOption(format =>
					format.setName('formato')
						.setDescription('Formato en el cual quieres recibir el audio descargado.')
						.addChoices(...formatChoices)
						.setRequired(true)
				)
				.addStringOption(quality =>
					quality.setName('bitrate')
						.setDescription('Calidad del audio en kbps')
						.setChoices(...qualityChoices)
						.setRequired(true)
				)
		)

	,
	async execute(interaction) {

		switch (interaction.options.getSubcommand()) {
			case 'play':
				return await ParseVideoIdOrName(interaction)
			case 'pause':
				return await PauseOrUnpauseSong(interaction)
			case 'queue':
				return await ShowQueue(interaction)
			case 'stop':
				return await StopPlayback(interaction)
			case 'next':
				return await SkipCurrentSong(interaction)
			case 'download':
				return await DownloadSong(interaction)

			default:
				return true
		}
	},
	async autocomplete(interaction) {
		const songName = interaction.options.getFocused()

		const filesIterator = Deno.readDir("downloads")

		let filteredFiles: string[] = []

		for await (const file of filesIterator) {

			if (file.name.length > 100) continue // Just skip this file if the name is too long.
			
			if (file.name.toLocaleLowerCase().includes(songName.toLowerCase())) {
				filteredFiles.push(file.name)
			}
		}

		filteredFiles = filteredFiles.slice(0, 25)

		return await interaction.respond(
			filteredFiles.map(filename => ({ name: filename.substring(0, 80), value: filename.substring(0, 100) }))
		)
	},
}

export default command