/** Distintos comandos para ayudar en el servidor, tambien para darle
a los miembros opciones de subir algun emoji o distintas cosas. */

import { SlashCommandBuilder } from "npm:discord.js@14.13.0";
import { SlashCommandTemplate } from "../../types/index.d.ts";
import { SuggestGuildEmoji } from "./subcommandHandlers/suggest-emoji.ts"

const command: SlashCommandTemplate = {
	data: new SlashCommandBuilder()
		.setName("sugerir")
		.setDMPermission(false)
		.setDescription("Multiples comandos para el servidor")
		.addSubcommand(emojis =>
			emojis.setName("emoji").setDescription("Sugerir un emoji para este servidor")
				.addAttachmentOption(emoji =>
					emoji.setName("imagen")
						.setDescription('Adjunta la imagen del emoji que quieres subir, debe ser jpg/png/gif')
						.setRequired(true)
				)
				.addStringOption(name =>
					name.setName('nombre')
						.setDescription('Nombre del emoji, 30 caracteres maximo.')
						.setRequired(true)
				)
		),
	async execute(i) {

		const SubCommand = i.options.getSubcommand()

		switch (SubCommand) {
			case 'emojis':
				await SuggestGuildEmoji(i)
				break
		}
	},
}

export default command