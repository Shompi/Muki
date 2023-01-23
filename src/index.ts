/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import * as dotenv from "dotenv"
dotenv.config()
import { Client, Collection, GuildTextBasedChannel } from "discord.js"
import { readdir } from "node:fs/promises"
import { EventFile, MessageCommand, SlashCommand } from "./types/index"

class MukiClient extends Client {
	commands: Collection<string, SlashCommand>
	messageCommands: Collection<string, MessageCommand>

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
		this.messageCommands = new Collection()
	}

	get suggestion_channel(): GuildTextBasedChannel {
		return this.channels.cache.get("1062586957567377448") as GuildTextBasedChannel
	}
}

const Muki = new MukiClient()

// Load event files
async function main() {
	const EventFiles = await readdir("js/events").then(files => files.filter(file => file.endsWith(".ts") || file.endsWith(".js")))

	for (const EventFile of EventFiles) {
		const event = (await import("./events/" + EventFile)).default as EventFile

		if (event.once) {
			//@ts-ignore
			Muki.once(event.name, (...args) => event.execute(...args))
		} else {
			//@ts-ignore
			Muki.on(event.name, (...args) => event.execute(...args))
		}

		console.log("EVENT FILE LOADED:", event.name);
	}

	Muki.commands = new Collection();
	Muki.messageCommands = new Collection();
	// Load commands into the client

	const CommandFiles = await readdir("js/interactionHandlers/slashcommands").then(files => files.filter(file => file.startsWith("cmd-") && file.endsWith(".ts") || file.endsWith(".js")));

	for (const CommandFile of CommandFiles) {
		const command = (await import(`./interactionHandlers/slashcommands/${CommandFile}`)).default as SlashCommand

		Muki.commands.set(command.data.name, command)

		console.log("COMMAND LOADED:", command.data.name);

	}

	/** Load message commands into the client */

	const MessageCommandFiles = await readdir("js/messageCommands")

	for (const CommandFile of MessageCommandFiles) {
		const command = (await import(`./messageCommands/${CommandFile}`)).default as MessageCommand

		Muki.messageCommands.set(command.name, command)
	}
	await Muki.login(process.env.BOT_TOKEN)
}

void main();