import { Events } from "discord.js";
import { InteractionCreateFile, MukiClient } from "../types/index";
import { AcceptEmojiSuggestion } from "../interactionHandlers/buttons/emoji-accept"
import { RejectEmojiSuggestion } from "../interactionHandlers/buttons/emoji-reject"
export default {
	name: Events.InteractionCreate,
	once: false,
	async execute(interaction) {
		const client = interaction.client as MukiClient
		try {
			if (interaction.inCachedGuild()) {
				if (interaction.isChatInputCommand()) {
					console.log(`Usuario ${interaction.user.username} usó el comando ${interaction.commandName}`)

					await client.commands.get(interaction.commandName)?.execute(interaction);
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