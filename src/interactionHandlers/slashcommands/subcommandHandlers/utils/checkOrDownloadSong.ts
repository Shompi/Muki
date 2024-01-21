import { ChatInputCommandInteraction } from "npm:discord.js@14.13.0"
import { exec } from "node:child_process"
import { promisify } from "node:util"
const Exec = promisify(exec)

//const DownloadQueue: string[] = []

/** Returns the name of the downloaded file or null if there was an error with the download*/
export async function CheckOrDownloadSong(interaction: ChatInputCommandInteraction<'cached'>, videoId: string): Promise<string | null> {

	// First lets check if the file can be found inside the folder
	const filesIterator = Deno.readDir("./downloads")


	for await (const file of filesIterator) {
		if (file.name.includes(videoId) && file.name.endsWith('.opus')) return file.name
	}

	// Else we need to download it
	// But first, check if we are already downloading a video.
	await interaction.editReply({ content: 'Tu video será descargado pronto', components: [] })

	const filepath = await Download(videoId).catch((e) => {
		console.error(e);
		return null
	})

	return filepath
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
		"\"downloads/%\(title\)s-%\(id\)s.%\(ext\)s\"",
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

	// Find the file in system
	const filesIterator = Deno.readDir('downloads')

	for await (const file of filesIterator) {
		if (file.name.includes(video_id) && file.name.endsWith('.opus')) return file.name
	}
	return null
}
