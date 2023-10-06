import { MessageCommand } from "../types/index.ts";
import { GenerateWelcomeImage } from "../events/utils/generate.ts";

const command: MessageCommand = {
	name: 'generate',
	ownerOnly: false,
	async execute(message, _) {

		const attachment = await GenerateWelcomeImage(message.member!)

		return void await message.reply({ files: [attachment] })
	}
}

export default command