import { AttachmentBuilder, GuildMember } from "discord.js";
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

export const GenerateWelcomeImage = async (member: GuildMember) => {

  const canvas = Canvas.createCanvas(1280, 640)
  const context = canvas.getContext('2d')

  const UserBannerUrl = await member.user.fetch(true).then(user => user.bannerURL({ size: 2048, extension: 'jpg' }))
  let Background: Canvas.Image

  if (UserBannerUrl) {
    const bannerBuffer = await request(UserBannerUrl).then(response => response.body.arrayBuffer())
    Background = await Canvas.loadImage(bannerBuffer)
  } else {
    Background = await Canvas.loadImage("./welcome/Banner.png")
  }

  context.filter = 'blur(4px)'
  context.drawImage(Background, 0, 0, canvas.width, canvas.height)
  context.filter = 'blur(0px)'

  const { body } = await request(member.displayAvatarURL({ size: 256, extension: 'jpg' }))
  const avatar = await Canvas.loadImage(await body.arrayBuffer())

  /** Username Text */
  context.font = applyText(canvas, `${member.user.tag}`, 110, "Anton")
  context.fillStyle = '#eeeeee'
  context.shadowColor = "#000000"
  context.shadowBlur = 2
  context.shadowOffsetX = 1
  context.shadowOffsetY = 1
  context.fillText(`${member.user.tag}`, 300, 340)
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

  return new AttachmentBuilder(await canvas.encode('png'), { name: 'WelcomeBanner.png' })
}