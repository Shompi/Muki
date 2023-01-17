import { MessageCommand } from "../types";

export = {
	name: 'test',
	ownerOnly: true,
	async execute(msg, args) {

		return await msg.reply({
			content: 'Hey!'
		})
	}
} as MessageCommand