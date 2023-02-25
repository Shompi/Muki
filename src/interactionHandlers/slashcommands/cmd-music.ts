import { SlashCommandTemplate } from "@myTypes/*";
import { SlashCommandBuilder } from "discord.js";
import { readdir } from "fs/promises"
import { PauseOrUnpauseSong } from "./subcommandHandlers/music-pause.js";
import { ParseVideoIdOrName } from "./subcommandHandlers/music-play.js";
import { SkipCurrentSong } from "./subcommandHandlers/music-skip.js";
import { ShowQueue } from "./subcommandHandlers/music-queue.js";
import { StopPlayback } from "./subcommandHandlers/music-stop.js";

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
		),
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

			default:
				return true
		}
	},
	async autocomplete(interaction) {
		const songName = interaction.options.getFocused()

		const files = await readdir("downloads").catch((e) => {
			console.log(e);
			return []
		})

		let filteredFiles: string[] = []

		filteredFiles = files.filter(file => file.toLowerCase().includes(songName.toLowerCase()))

		filteredFiles = filteredFiles.slice(0, 25)

		return await interaction.respond(
			filteredFiles.map(filename => ({ name: filename, value: filename }))
		)
	},
}

export default command