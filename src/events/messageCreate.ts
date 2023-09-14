import { EventFile } from "../types/index.d.ts";
import { Events } from "npm:discord.js@14.13.0";
import { ChatCompletion } from "./utils/chat.ts";

export default {
	name: Events.MessageCreate,
	once: false,
	async execute(message) {

		if (message.author.bot) return;

		if (message.content.startsWith(`<@${message.client.user.id}>`)) {
			const answered = await ChatCompletion(message)

			if (!answered) return void await message.reply({ content: 'Hola! ' + message.client.emojis.cache.random()?.toString() })
		}
	}
} satisfies EventFile<"messageCreate">