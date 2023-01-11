import * as dotenv from "dotenv"
dotenv.config()
import { Client, Collection, GuildTextBasedChannel } from "discord.js"
import { readdir } from "node:fs/promises"
import { MessageCommand, SlashCommand } from "./types/index"

class MukiClient extends Client {
	constructor() {
		super({
			intents: [
				"GuildBans",
				"GuildEmojisAndStickers",
				"GuildInvites",
				"GuildMembers",
				"GuildMessages",
				"GuildPresences",
				"Guilds",
			]
		})
		/* The commands collection of this bot */
		this.commands = new Collection()
	}

	get suggestion_channel(): GuildTextBasedChannel {
		return this.channels.cache.get("1062586957567377448") as GuildTextBasedChannel
	}
}

const Muki = new MukiClient()

// Load event files
async function main() {
	const EventFiles = await readdir("src/events").then(files => files.filter(file => file.endsWith(".ts")))

	for (const EventFile of EventFiles) {
		const event: any = (await import("./events/" + EventFile)).default

		if (event.once) {
			Muki.once(event.name, (...args) => event.execute(...args))
		} else {
			Muki.on(event.name, (...args) => event.execute(...args))
		}

		console.log("EVENT FILE LOADED:", event.name);
	}

	Muki.commands = new Collection();
	Muki.messageCommands = new Collection();
	// Load commands into the client

	const CommandFiles = await readdir("src/interactionHandlers/slashcommands").then(files => files.filter(file => file.startsWith("cmd-") && file.endsWith(".ts")));

	for (const CommandFile of CommandFiles) {
		const command: SlashCommand = (await import(`./interactionHandlers/slashcommands/${CommandFile}`)).default

		Muki.commands.set(command.data.name, command)
	}

	/** Load message commands into the client */

	const MessageCommandFiles = await readdir("src/messageCommands")

	for (const CommandFile of MessageCommandFiles) {
		const command: MessageCommand = await import(`./messageCommands/${CommandFile}`)

		Muki.messageCommands.set(command.name, command)
	}
	Muki.login(process.env.BOT_TOKEN)
}

main();