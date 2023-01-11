import { Events } from "discord.js";
import { InteractionCreateFile } from "../types/index";
import { AcceptEmojiSuggestion } from "../interactionHandlers/buttons/emoji-accept"
import { RejectEmojiSuggestion } from "../interactionHandlers/buttons/emoji-reject"
export default {
	name: Events.InteractionCreate,
	once: false,
	async execute(interaction) {
		console.log("interaction received");
		if (interaction.inCachedGuild()) {
			if (interaction.isChatInputCommand()) {
				const client = interaction.client;
				console.log(`Usuario ${interaction.user.username} usó el comando ${interaction.commandName}`)

				client.commands.get(interaction.commandName)?.execute(interaction);
			}

			if (interaction.isButton()) {
				switch (interaction.customId) {
					case 'emoji-accept':
						AcceptEmojiSuggestion(interaction)
						break
					case 'emoji-reject':
						RejectEmojiSuggestion(interaction)
						break
				}
			}
		}
	}
} as InteractionCreateFile