import { Events } from "npm:discord.js@14.13.0";
import { EventFile } from "../types/index.d.ts";
import { AcceptEmojiSuggestion } from "../interactionHandlers/buttons/emoji-accept.ts"
import { RejectEmojiSuggestion } from "../interactionHandlers/buttons/emoji-reject.ts"
import { ReopenChannel } from "../interactionHandlers/buttons/channel-reopen.ts";

export default {
	name: Events.InteractionCreate,
	once: false,
	async execute(interaction) {

		if (!interaction.inCachedGuild()) return interaction.isRepliable() ? interaction.reply("✅") : undefined

		const client = interaction.client
		try {

			if (interaction.isChatInputCommand()) {
				console.log(`Usuario ${interaction.user.username} usó el comando ${interaction.commandName}`)

				await client.commands.get(interaction.commandName)?.execute(interaction)
			}

			if (interaction.isAutocomplete()) {
				await client.commands.get(interaction.commandName)?.autocomplete?.(interaction)
			}

			if (interaction.isButton()) {
				switch (interaction.customId) {
					case 'emoji-accept':
						await AcceptEmojiSuggestion(interaction)
						break
					case 'emoji-reject':
						await RejectEmojiSuggestion(interaction)
						break
					case 'channel-reopen':
						await ReopenChannel(interaction)
						break
				}
			}

		} catch (e) {
			console.log(e);
			return
		}
	}
} satisfies EventFile<Events.InteractionCreate>