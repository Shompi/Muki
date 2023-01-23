import { MessageCommand } from "../types";

export default {
	name: 'test',
	ownerOnly: true,
	async execute(msg, args) {

		return await msg.reply({
			content: 'Hey!'
		})
	}
} as MessageCommand