import { Events } from "discord.js";
import { InteractionCreateFile } from "../types/index";

export default {
	name: Events.InteractionCreate,
	once: false,
	async execute(interaction) {
		console.log("interaction received");

		if (interaction.isChatInputCommand() && interaction.inCachedGuild()) {
			const client = interaction.client;
			console.log(`Usuario ${interaction.user.username} usó el comando ${interaction.commandName}`)

			client.commands.get(interaction.commandName)?.execute(interaction);
		}

	}
} as InteractionCreateFile