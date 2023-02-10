import { MessageCommand } from "../types";

export default {
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
} as MessageCommand