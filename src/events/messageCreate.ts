import { EventFile } from "@myTypes/*";
import { Events, type Message } from "discord.js";

export default {
	name: Events.MessageCreate,
	once: false,
	async execute(msg) {

		const client = msg.client

		if (msg.author.bot || msg.channel.isDMBased()) return;

		if (msg.content.startsWith(`<@${msg.client.user.id}>`)) {
			const SplitContent = msg.content.split(" ").slice(1)

			if (SplitContent.length === 0) return await msg.reply({ content: 'Hola!' })

			const CommandName = SplitContent.shift()

			if (!CommandName) return

			const Command = client.messageCommands.get(CommandName)

			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			if (!Command) return msg.reply({ content: `Hola! ${msg.client.emojis.cache.random() ?? ""}` })

			if (Command.ownerOnly && msg.author.id !== "166263335220805634") return

			return void Command.execute(msg, SplitContent)
		}
	}
} satisfies EventFile<"messageCreate">