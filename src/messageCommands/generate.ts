import { MessageCommand } from "@myTypes/*";
import { AttachmentBuilder } from "discord.js";
import * as Canvas from "@napi-rs/canvas";
import { request } from 'undici'

Canvas.GlobalFonts.registerFromPath('./welcome/fonts/Anton-Regular.ttf', "Anton")

const applyText = (canvas: Canvas.Canvas, text: string, fontsize: number, font: string) => {
	const context = canvas.getContext('2d');
	let fontSize = fontsize;

	do {
		context.font = `${fontSize -= 10}px ${font}`;
	} while (context.measureText(text).width > canvas.width * 0.75);

	return context.font;
};

const Command: MessageCommand = {
	name: 'generate',
	ownerOnly: true,
	async execute(m, args) {
		const target = m.client.users.cache.random()!
		const canvas = Canvas.createCanvas(1280, 640)
		const context = canvas.getContext('2d')
		const Background = await Canvas.loadImage("./welcome/Banner.png")

		context.drawImage(Background, 0, 0, canvas.width, canvas.height)

		const { body } = await request(target.displayAvatarURL({ size: 256, extension: 'jpg' }))
		const avatar = await Canvas.loadImage(await body.arrayBuffer())


		/** Username Text */
		context.font = applyText(canvas, `${target.username}`, 110, "Anton")
		context.fillStyle = '#eeeeee'
		context.shadowColor = "#000000"
		context.shadowBlur = 2
		context.shadowOffsetX = 1
		context.shadowOffsetY = 1
		context.fillText(`${target.username}`, 300, 340)
		/** ----- */

		/** Member count text */
		context.font = applyText(canvas, `Eres el miembro #${m.guild!.memberCount}`, 52, "Anton")
		context.fillStyle = '#cacaca'
		context.fillText(`Eres el miembro #${m.guild!.memberCount}`, 300, 390)
		/** ----- */

		// Pick up the pen
		context.beginPath()

		// Start the arc to form a circle
		context.arc(125 + 28, 325 - 7, 128, 0, Math.PI * 2, true)

		// Put the pen down
		context.closePath()

		// Clip off the region you drew on
		context.clip()

		context.drawImage(avatar, 25, 190, 256, 256)

		const Attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'WelcomeBanner.png' })

		return void await m.reply({
			content: 'Aquí está la imagen!',
			files: [Attachment]
		})
	},
}

export default Command