import { PermissionsBitField, SlashCommandBuilder } from "npm:discord.js@14.13.0";
import { SlashCommandTemplate } from "../../types/index.ts";
import { GenerateWelcomeImage } from "../../events/utils/generate.ts";
PermissionsBitField.Flags.ModerateMembers

const command: SlashCommandTemplate = {
	data: new SlashCommandBuilder()
		.setName("test")
		.setDMPermission(false)
		.setDescription("Comando de prueba"),
	async execute(interaction) {

		await interaction.deferReply({ ephemeral: true })

		const attachment = await GenerateWelcomeImage(interaction.member!)

		await interaction.editReply({ files: [attachment] })
	}
}

export default command