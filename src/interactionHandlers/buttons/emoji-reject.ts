import { ActionRowBuilder, ButtonInteraction, Colors, EmbedBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";

export async function RejectEmojiSuggestion(i: ButtonInteraction<"cached">) {

	if (!i.memberPermissions.has("ManageEmojisAndStickers"))
		return await i.reply({ content: 'Lo siento, no cuentas con los permisos necesarios para realizar esta acción.', ephemeral: true })

	const SuggestionEmbed = EmbedBuilder.from(i.message.embeds[0])
		.setColor(Colors.Red)

	const ReasonModal = new ModalBuilder()
		.setTitle("Emoji Rechazado")
		.setCustomId('modal-emoji-suggestion-reject')
		.addComponents(
			new ActionRowBuilder<TextInputBuilder>()
				.setComponents(
					[
						new TextInputBuilder()
							.setCustomId('emoji-reject-reason')
							.setLabel('Razón por la que rechazaste el emoji')
							.setRequired(false)
							.setPlaceholder('No requerido')
							.setMaxLength(100)
							.setStyle(TextInputStyle.Paragraph)
					]
				)
		)

	await i.showModal(ReasonModal)

	const ReasonSubmission = await i.awaitModalSubmit({
		time: 60_000,
	}).catch(() => null)

	const Reason = ReasonSubmission?.fields.getTextInputValue('emoji-reject-reason')

	SuggestionEmbed.setFooter({ text: `Razón: ${Reason ?? "-"}` })

	await ReasonSubmission?.reply({ content: '¡Gracias!', ephemeral: true })

	return await i.message.edit({
		embeds: [SuggestionEmbed],
		components: []
	})
}