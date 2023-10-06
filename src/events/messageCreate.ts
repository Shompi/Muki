import { EventFile } from "../types/index.ts";
import { Events } from "npm:discord.js@14.13.0";
import { ChatCompletion } from "./utils/chat.ts";

export default {
	name: Events.MessageCreate,
	once: false,
	async execute(message) {

		if (message.author.bot) return;
		const args = message.content.split(" ").slice(1)
		const messageCommand = message.client.messageCommands.get(args[0])

		if (messageCommand) {
			if (!messageCommand.ownerOnly) {
				return messageCommand.execute(message, args)
			}

			if (message.author.id === "166263335220805634")
				return messageCommand.execute(message, args)
		}

		return;
		if (message.content.startsWith(`<@${message.client.user.id}>`)) {
			const answered = await ChatCompletion(message)

			if (!answered) return void await message.reply({ content: 'Hola! ' + message.client.emojis.cache.random()?.toString() })
		}
	}
} satisfies EventFile<"messageCreate">