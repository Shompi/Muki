import { MessageCommand } from "../types";

const Command: MessageCommand = {
	name: 'test',
	ownerOnly: true,
	async execute(msg, args) {
		if (msg.guild) {
			const sticker = msg.guild.stickers.cache.random()

			if (sticker) {

				void await msg.reply({
					content: 'Hey!!',
					stickers: [sticker]
				})
			} else {
				void await msg.reply({ content: 'Hey!!' })
			}

		}
	}
}

export default Command