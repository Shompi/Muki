import { Events, type Message } from "discord.js"
export default {
	name: Events.MessageCreate,
	once: false,
	async execute(msg: Message) {

		if (msg.author.bot) return;

		if (msg.content.startsWith(`<@${msg.client.user.id}>`)) {
			const SplitContent = msg.content.split(" ").slice(1)

			if (SplitContent.length === 0) return await msg.reply({ content: 'Hola!' })

			const CommandName = SplitContent.shift()
			if (!CommandName) return
			if (!msg.client.messageCommands.has(CommandName)) return

			const Command = msg.client.messageCommands.get(CommandName)!

			if (Command.ownerOnly && msg.author.id !== "166263335220805634") return

			return await Command.execute(msg, SplitContent)
		}
	}
}