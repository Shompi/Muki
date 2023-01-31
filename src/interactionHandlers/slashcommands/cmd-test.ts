import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "@myTypes/index";

export default {
	data: new SlashCommandBuilder()
		.setName("test")
		.setDMPermission(false)
		.setDescription("Comando de prueba"),
	async execute(interaction) {

		return await interaction.reply({ content: 'Hey!' })

	},


} as SlashCommand