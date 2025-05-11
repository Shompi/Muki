import { PermissionsBitField, SlashCommandBuilder } from "discord.js";
import type { SlashCommandTemplate } from "../../types/index.ts";
// import { GenerateWelcomeImage } from "../../events/utils/generate.ts";
PermissionsBitField.Flags.ModerateMembers

const command: SlashCommandTemplate = {
	data: new SlashCommandBuilder()
		.setName("test")
		.setDMPermission(false)
		.setDescription("Comando de prueba"),
	async execute(interaction) {

		await interaction.reply({ ephemeral: true, content: "Comando deshabilitado" })

/* 		const attachment = await GenerateWelcomeImage(interaction.member!) */

/* 		await interaction.editReply({ files: [attachment] }) */
	}
}

export default command