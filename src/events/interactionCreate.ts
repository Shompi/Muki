import { Events } from "discord.js";
import { InteractionCreateFile, MukiClient } from "@myTypes/index";
import { AcceptEmojiSuggestion } from "../interactionHandlers/buttons/emoji-accept.js"
import { RejectEmojiSuggestion } from "../interactionHandlers/buttons/emoji-reject.js"

export default {
	name: Events.InteractionCreate,
	once: false,
	async execute(interaction) {

		if (!interaction.inCachedGuild()) return interaction.isRepliable() ? interaction.reply("✅") : undefined

		const client = interaction.client as MukiClient
		try {

			if (interaction.isChatInputCommand()) {
				console.log(`Usuario ${interaction.user.username} usó el comando ${interaction.commandName}`)

				await client.commands.get(interaction.commandName)?.execute(interaction)
			}

			if (interaction.isButton()) {
				switch (interaction.customId) {
					case 'emoji-accept':
						await AcceptEmojiSuggestion(interaction)
						break
					case 'emoji-reject':
						await RejectEmojiSuggestion(interaction)
						break
				}
			}

		} catch (e) {
			console.log(e);
			if (interaction.isRepliable()) {
				if (interaction.deferred || interaction.replied)
					return await interaction.editReply({ content: 'La interacción ha finalizado.' })

				else await interaction.reply({ content: 'La interacción ha finalizado.' })
			}
		}
	}
} as InteractionCreateFile