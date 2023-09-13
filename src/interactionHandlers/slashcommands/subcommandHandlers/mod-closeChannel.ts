import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction } from "discord.js";

const reopenButton = new ButtonBuilder()
	.setCustomId('channel-open')
	.setEmoji("🔑")
	.setLabel('Reabrir el canal')
	.setStyle(ButtonStyle.Primary)

const row = new ActionRowBuilder<ButtonBuilder>()
	.setComponents(reopenButton)

export async function CloseChannel(interaction: ChatInputCommandInteraction<'cached'>) {
	const { channel } = interaction

	if (channel) {
		try {
			await channel.edit({
				permissionOverwrites: [
					{
						id: channel.guildId,
						deny: ["SendMessages"]
					}
				]
			})

			await interaction.reply({
				content: 'El canal ha sido cerrado.',
				components: [row]
			})

		} catch (e) {
			console.log(e);
			await interaction.reply({
				content: 'Ocurrió un error con el comando, revisa en la consola.',
				ephemeral: true
			})
		}
	}
}