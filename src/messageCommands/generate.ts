import { MessageCommand } from "@myTypes/*";
import * as Canvas from "@napi-rs/canvas"
import { GenerateWelcomeImage } from "../events/utils/generate";

const command: MessageCommand = {
	name: 'generate',
	ownerOnly: true,
	async execute(message, args) {

		const attachment = await GenerateWelcomeImage(message.member!)

		return void await message.reply({ files: [attachment] })
	}
}

export default command