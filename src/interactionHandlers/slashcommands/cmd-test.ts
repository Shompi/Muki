import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../types/index";

export default {
	data: new SlashCommandBuilder()
		.setName("test")
		.setDescription("Comando de prueba"),
	async execute(interaction) {

		return await interaction.reply({ content: 'Hey!' })

	},


} as SlashCommand