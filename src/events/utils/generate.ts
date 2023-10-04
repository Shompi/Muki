import { AttachmentBuilder, GuildMember } from "npm:discord.js";
import * as Canvas from "https://deno.land/x/skia_canvas@0.5.4/mod.ts";
import { Buffer } from "https://deno.land/std@0.202.0/io/buffer.ts"

Canvas.Fonts.register('./welcome/fonts/Anton-Regular.ttf')

const applyText = (canvas: Canvas.Canvas, text: string, fontsize: number, font: string) => {
	const context = canvas.getContext('2d');
	let fontSize = fontsize;

	do {
		context.font = `${fontSize -= 10}px ${font}`;
	} while (context.measureText(text).width > canvas.width * 0.75);

	return context.font;
};

export const GenerateWelcomeImage = async (member: GuildMember) => {

	const canvas = Canvas.createCanvas(1280, 640)
	const context = canvas.getContext('2d')

	const UserBannerUrl = await member.user.fetch(true).then(user => user.bannerURL({ size: 2048, extension: 'jpg' }))
	let Background: Canvas.Image

	if (UserBannerUrl) {
		Background = await Canvas.Image.load(UserBannerUrl)
	} else {
		Background = await Canvas.Image.load("./welcome/Banner.png")
	}

	context.filter = 'blur(4px)'
	context.drawImage(Background, 0, 0, canvas.width, canvas.height)
	context.filter = 'blur(0px)'

	const avatar = await Canvas.Image.load(member.displayAvatarURL({ size: 256, extension: 'jpg' }))

	/** Username Text */
	context.font = applyText(canvas, `${member.user.displayName}`, 110, "Anton")
	context.fillStyle = '#eeeeee'
	context.shadowColor = "#000000"
	context.shadowBlur = 2
	context.shadowOffsetX = 1
	context.shadowOffsetY = 1
	context.fillText(`${member.user.displayName}`, 300, 340)
	/** ----- */

	/** Member count text */
	context.font = applyText(canvas, `¡Bienvenido al servidor!\nEres el miembro N°${member.guild.memberCount}`, 42, "Anton")
	context.fillStyle = '#cacaca'
	context.fillText(`¡Bienvenido al servidor!\nEres el miembro N°${member.guild.memberCount}`, 300, 390)
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

	const filepath = `./welcome/temp/${member.id}.png`

	// We need to save the image to disk for now
	canvas.save(filepath, "png", 90)

	// TODO
	return new AttachmentBuilder(filepath, { name: 'WelcomeBanner.jpeg' })
}