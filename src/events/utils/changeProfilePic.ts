import { Client, Collection } from "discord.js";
import { readdirSync } from "node:fs"

const ImageFiles = readdirSync("src/resources/pictures")
const ImageCollection = new Collection<string, string>()
const baseImagePath = "src/resources/pictures/"

for (const filename of ImageFiles) {
	ImageCollection.set(filename, `${baseImagePath}${filename}`)
}

export async function ChangeProfilePicture(client: Client) {

	/** Chose a random file */
	const ImagePath = ImageCollection.random()!

	return await client.user?.setAvatar(ImagePath)
}