import * as dotenv from "dotenv"
dotenv.config()
import { Client, Collection } from "discord.js"
import { readdir } from "node:fs/promises"
import { SlashCommand } from "muki"
import { ClientOptions } from "ws"

class CustomClient extends Client {
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
		this.commands = new Collection();
	}
}


const Muki = new CustomClient()

// Load event files
const EventFiles = await readdir("src/events").then(files => files.filter(file => file.endsWith(".js")))

for (const EventFile of EventFiles) {
	const event: any = (await import("./events/" + EventFile)).default

	if (event.once) {
		Muki.once(event.name, (...args) => event.execute(...args))
	} else {
		Muki.on(event.name, (...args) => event.execute(...args))
	}

	console.log("EVENT FILE LOADED:", event.name);
}

// Load commands into the client

Muki.commands = new Collection();
const CommandFiles = await readdir("src/interactionHandlers/slashcommands").then(files => files.filter(file => file.startsWith("cmd-") && file.endsWith(".js")));

for (const CommandFile of CommandFiles) {
	const command: SlashCommand = (await import(`./interactionHandlers/slashcommands/${CommandFile}`)).default

	Muki.commands.set(command.data.name, command)

}

Muki.login(process.env.BOT_TOKEN)