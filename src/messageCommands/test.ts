import { MessageCommand } from "../types/index.d.ts";

const Command: MessageCommand = {
	name: 'test',
	ownerOnly: true,
	async execute(msg, args) {

		void await msg.reply({ content: 'Test!' })
	}
}

export default Command