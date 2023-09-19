import * as dotenv from "npm:dotenv"
dotenv.config()

import "npm:libsodium-wrappers"
import "npm:opusscript"
import { Client, Collection, Guild, GuildTextBasedChannel, Partials, TextChannel } from "npm:discord.js"
import { readdir } from "node:fs/promises"
import type { MessageCommand, SlashCommandTemplate } from "./types/index.d.ts"

class MukiClient extends Client {

	constructor() {
		super({
			intents: [
				"GuildBans",
				"GuildEmojisAndStickers",
				"GuildInvites",
				"GuildMembers",
				"GuildPresences",
				"Guilds",
				"GuildVoiceStates",
				"GuildMessages"
			],
			partials: [Partials.GuildMember, Partials.User, Partials.Channel]
		})
		/* The commands collection of this bot */
		this.commands = new Collection()
		this.messageCommands = new Collection()

		this.loadEmojis = () => {

			this.util = {
				emoji: {
					angry: this.emojis.cache.get('1062671810589630505')!,
					question: this.emojis.cache.get('1079114733283704853')!,
					sad: this.emojis.cache.get('1079115149887143936')!,
					tehe: this.emojis.cache.get('868322845216890950')!,
					thumbsup: this.emojis.cache.get('654467568152870922')!,
				}
			}
			return true
		}
	}

	get suggestion_channel() {
		return this.channels.cache.get("1062586957567377448") as GuildTextBasedChannel
	}

	get selfroles_channel() {
		return this.channels.cache.get("865360481940930560") as TextChannel
	}

	get mainGuild(): Guild {
		return this.guilds.cache.get('537484725896478733') as Guild
	}
}

const Muki = new MukiClient()

// Load event files
async function main() {
	const Files = Deno.readDir("./src/events")

	for await (const file of Files) {
		if (file.isDirectory) continue
		//@ts-ignore I can't seem to type this correctly.
		// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return
		const event = (await import("./events/" + file.name).then(mod => mod.default))


		if (event?.once) {
			//@ts-ignore I can't type this either
			// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
			Muki.once(event.name, (...args) => event.execute(...args))
		} else {
			//@ts-ignore I can't type this but it doesnt matter
			// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
			Muki.on(event.name, (...args) => event.execute(...args))
		}

		console.log("EVENT FILE LOADED:", event.name);
	}

	Muki.commands = new Collection();
	Muki.messageCommands = new Collection();
	// Load commands into the client

	const CommandFiles = await readdir("src/interactionHandlers/slashcommands").then(files => files.filter(file => file.endsWith(".ts")));

	for (const CommandFile of CommandFiles) {
		const command = (await import(`./interactionHandlers/slashcommands/${CommandFile}`)).default as SlashCommandTemplate

		Muki.commands.set(command.data.name, command)

		console.log("COMMAND LOADED:", command.data.name);

	}

	/** Load message commands into the client */

	const MessageCommandFiles = await readdir("src/messageCommands")

	for (const CommandFile of MessageCommandFiles) {
		const command = (await import(`./messageCommands/${CommandFile}`)).default as MessageCommand

		Muki.messageCommands.set(command.name, command)
	}
	await Muki.login(Deno.env.get('BOT_TOKEN'))
}

void main();