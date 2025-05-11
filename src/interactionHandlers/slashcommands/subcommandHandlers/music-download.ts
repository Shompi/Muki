import { exec } from 'node:child_process';
import { readdir } from 'node:fs/promises';
import { setTimeout } from "node:timers/promises";
import { promisify } from "node:util";
import { ChatInputCommandInteraction } from "discord.js";
import { isValidId } from "./music-play.ts";

const Exec = promisify(exec)

export async function DownloadSong(interaction: ChatInputCommandInteraction<'cached'>) {

	const videoNameOrId = interaction.options.getString('video', true)

	if (isValidId(videoNameOrId)) {
		await interaction.reply({ content: 'El video está siendo descargado, por favor espera unos minutos...', ephemeral: true })
		const downloaded = await Download(videoNameOrId)
		if (!downloaded)
			return await interaction.editReply({ content: 'Ocurrió un error con la descarga del video. Esto puede deberse a las siguientes razones:\n- Error Interno\n- El video es demasiado pesado' })
	}

	return null
}

async function Download(video_id: string): Promise<string | null> {
	const youtubeBaseUrl = "https://youtube.com/watch?v="

	const ytdlArgs = [
		//"youtube-dl",
		// "--id", // Use only ID in the file name
		"-w", // No overwrites
		"-x", // Extract audio only
		"--audio-format",
		"opus",
		"--audio-quality",
		"192K",
		"-o",
		// eslint-disable-next-line no-useless-escape
		"'downloads/%\(title\)s-%\(id\)s.%\(ext\)s'",
		"-r",
		"2.5M", // Maximum download rate of 2.5Mb
		// eslint-disable-next-line @typescript-eslint/restrict-plus-operands
		youtubeBaseUrl + video_id,
		//"--simulate", // Do not download any video
	]
	console.log("Creando child youtube-dl")
	// eslint-disable-next-line no-useless-escape
	const { stdout, stderr } = await Exec(`yt-dlp ${ytdlArgs.join(" ")}`)

	console.log('[DEBUG yt-dlp] stdout:', stdout);

	if (stderr) {
		return null
	}

	console.log("yt-dlp ha terminado de descargar.")
	await setTimeout(2000) // Lets wait to seconds for the process to exit gracefully.


	// Find the file in system
	const files = await readdir('downloads')
	if (files.length === 0) return null


	console.log("Buscando archivo en downloads...")

	const video = files.find(file => file.includes(video_id) && file.endsWith('.opus'))
	if (!video) return null

	console.log(`Video encontrado en la carpeta: ${video}`)
	return video
}
