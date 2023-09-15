import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ComponentType, PermissionsBitField, SlashCommandBuilder } from "npm:discord.js@14.13.0";
import { SlashCommandTemplate } from "../../types/index.d.ts";
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