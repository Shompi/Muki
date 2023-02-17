import { MessageCommand } from "@myTypes/*";
import { GenerateWelcomeImage } from "../events/utils/generate.js";

const command: MessageCommand = {
	name: 'generate',
	ownerOnly: true,
	async execute(message, args) {

		const attachment = await GenerateWelcomeImage(message.member!)

		return void await message.reply({ files: [attachment] })
	}
}

export default command