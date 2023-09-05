import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Component, ComponentType, PermissionsBitField, SlashCommandBuilder } from "discord.js";
import { SlashCommandTemplate } from "@myTypes/index";
PermissionsBitField.Flags.ModerateMembers

const command: SlashCommandTemplate = {
	data: new SlashCommandBuilder()
		.setName("test")
		.setDMPermission(false)
		.setDescription("Comando de prueba"),
	async execute(interaction) {

		const ActionRow = new ActionRowBuilder<ButtonBuilder>()
			.setComponents(
				new ButtonBuilder()
					.setCustomId('testbutton')
					.setLabel('Press me')
					.setStyle(ButtonStyle.Success)
			)

		const message = await interaction.reply({
			content: 'Test!',
			components: [ActionRow]
		})

		message.createMessageComponentCollector({
			componentType: ComponentType.Button,
			max: 1
		})
			.on('collect', (buttonInt) => {
				buttonInt.editReply("The button was pressed!")
			})

	},


}

export default command