import { ActionRowBuilder, ButtonBuilder, ButtonInteraction } from "discord.js";

export async function ReopenChannel(interaction: ButtonInteraction<'cached'>) {

	const { member, channel } = interaction

	if (member.permissions.any(["ModerateMembers", "ManageChannels"])) {
		try {

			if (channel && !channel.isThread() && !channel.isDMBased()) {

				await interaction.deferUpdate()
				await channel.permissionOverwrites.edit(channel.guild.roles.everyone, {
					SendMessages: null
				})

				const button = ButtonBuilder.from(interaction.component).setDisabled(true)
				const row = new ActionRowBuilder<ButtonBuilder>().setComponents(button)

				await interaction.update({
					content: 'El canal ha sido desbloqueado.',
					components: [row]
				})
			}
		}
		catch (e) {
			console.log(e);
			return await interaction.reply({
				ephemeral: true,
				content: 'Ocurrió un error con esta interacción.'
			})

		}
	} else {
		await interaction.reply({
			content: 'Solo un moderador puede usar esta interacción.',
			ephemeral: true
		})
	}
}