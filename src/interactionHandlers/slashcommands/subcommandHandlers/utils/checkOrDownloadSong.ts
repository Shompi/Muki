import { ChatInputCommandInteraction } from "discord.js"
import { readdir } from "fs/promises"
import { spawn } from "node:child_process"
import { EventEmitter } from "node:events"

interface DownloadRequest {
	interaction: ChatInputCommandInteraction<'cached'>,
	video_id: string
}

/** Holds video ids */
const DownloadQueue: DownloadRequest[] = []

enum DownloaderStates {
	Downloading = 1,
	Idle
}

let DownloaderState = DownloaderStates.Idle


export async function CheckOrDownloadSong(interaction: ChatInputCommandInteraction<'cached'>, videoId?: string): Promise<void> {

	if (!videoId) return void interaction.editReply({ content: 'No se recibio una id de video.' })

	// First lets check if the file can be found inside the folder
	const files = await readdir("./downloads")

	if (files.length >= 0) {
		const file = files.find(file => file.includes(videoId))

		if (file) {
			// File is in the system
			interaction.client.emit('music-play', videoId)
			return
		}

		if (DownloaderState === DownloaderStates.Downloading) {
			void await interaction.editReply({
				content: 'Tu canción será añadida a la cola de descargas!'
			})

			DownloadQueue.push({ interaction, video_id: videoId })
			return
		}

		Download({ video_id: videoId, interaction })
	}
}

function Download({ video_id, interaction }: DownloadRequest) {

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
		"downloads/%\(title\)s-%\(id\)s.%\(ext\)s",
		youtubeBaseUrl + video_id,
		//"--simulate", // Do not download any video
	]
	console.log("Creando child youtube-dl")
	// eslint-disable-next-line no-useless-escape
	const process = spawn("youtube-dl", ytdlArgs, { stdio: "inherit" })

	process.on('spawn', () => {
		console.log("Comenzando la descarga del video");
		DownloaderState = DownloaderStates.Downloading
	})

	process.on('close', (code) => {
		if (code !== 0) {
			return void interaction.channel?.send({ content: `Ocurrió un error con la descarga del video ${video_id}` })
		}

		Downloader.emit('finish')
		interaction.client.emit('music-play', interaction, video_id)
	})
}

const Downloader = new EventEmitter()
	.on('finish', () => {

		// Check if there is more videos on queue
		if (DownloadQueue.length > 0) {
			return void Download(DownloadQueue.shift()!)
		}

		// If there is nothing else to download, we can just set the state of the downloader to idle
		DownloaderState = DownloaderStates.Idle
	})