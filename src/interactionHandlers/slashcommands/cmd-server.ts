/** Distintos comandos para ayudar en el servidor, tambien para darle
a los miembros opciones de subir algun emoji o distintas cosas. */

import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../types/index";
import { SuggestGuildEmoji } from "./subcommandHandlers/server-emojis-suggest.js"

export default {
	data: new SlashCommandBuilder()
		.setName("server")
		.setDescription("Multiples comandos para el servidor")
		.addSubcommandGroup(emojis =>
			emojis.setName("emojis").setDescription("Comandos relacionados a emojis del servidor")
				.addSubcommand(add =>
					add.setName('sugerir')
						.setDescription('Envia un emoji como sugerencia para el servidor!')
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
				)
		),
	async execute(i) {

		const SubCommandGroup = i.options.getSubcommandGroup()
		const SubCommand = i.options.getSubcommand()

		if (SubCommandGroup) {

			switch (SubCommandGroup) {
				case 'emojis':
					if (SubCommand === 'sugerir')
						return await SuggestGuildEmoji(i)
					break
			}
		}

	},

} as SlashCommand