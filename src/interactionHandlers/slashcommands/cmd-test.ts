import { PermissionsBitField, SlashCommandBuilder } from "discord.js";
import { SlashCommandTemplate } from "@myTypes/index";
PermissionsBitField.Flags.ModerateMembers

const command: SlashCommandTemplate = {
	data: new SlashCommandBuilder()
		.setName("test")
		.setDMPermission(false)
		.setDescription("Comando de prueba"),
	async execute(interaction) {

		return await interaction.reply({ content: 'Hey!' })

	},


}

export default command