import { ChatInputCommandInteraction } from "discord.js"
import { readdir } from "fs/promises"
import { spawn } from "node:child_process"
const Terminal = process.platform === "win32" ? "powershell" : "bash"

export async function CheckOrDownloadSong(interaction: ChatInputCommandInteraction<'cached'>, videoId?: string): Promise<string | null> {

	if (!videoId) return null

	// First lets check if the file can be found inside the folder
	const files = await readdir("./downloads")

	if (files.length >= 0) {
		const file = files.find(file => file.includes(videoId))

		if (file) return videoId

		await interaction.editReply({ content: '⌛ Descargando video, por favor espera unos segundos...' })

		const result = await Download(videoId).catch(console.error)

		if (!result)
			return null

		return videoId
	}

	return null
}

async function Download(videoId: string) {

	const youtubeBaseUrl = "https://youtube.com/watch?v="

	const ytdlArgs = [
		"youtube-dl",
		// "--id", // Use only ID in the file name
		"-w", // No overwrites
		"-x", // Extract audio only
		"--audio-format opus",
		"--audio-quality 192K",
		// eslint-disable-next-line no-useless-escape
		//'-o "./downloads/%\(title\)s %\(id\)s.%\(ext\)s"',
		youtubeBaseUrl + videoId,
		//"--simulate", // Do not download any video
	]

	return new Promise((resolve, reject) => {

		console.log("Creando child youtube-dl");
		const process = spawn(Terminal, ytdlArgs, { stdio: "inherit" })

		process.on('spawn', () => {
			console.log("Comenzando la descarga del video");
		})

		process.on("exit", (code) => {
			if (code !== 0)
				reject(new Error("El programa terminó debido a un error"))

			resolve(true)
		})

		process.on('close', (code) => {
			if (code !== 0)
				reject(new Error("El programa terminó debido a un error"))

			resolve(true)
		})
	})
}