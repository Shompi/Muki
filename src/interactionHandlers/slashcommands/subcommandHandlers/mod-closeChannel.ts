import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction } from "npm:discord.js@14.13.0";

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
			if (channel.isTextBased() && !channel.isThread()) {

				await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
					SendMessages: false
				})

				await interaction.reply({
					content: 'El canal ha sido cerrado.',
					components: [row]
				})

			}
		} catch (e) {
			console.log(e);
			await interaction.reply({
				content: 'Ocurrió un error con el comando, revisa en la consola.',
				ephemeral: true
			})
		}
	}

}