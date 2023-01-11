import { ButtonInteraction, Colors, EmbedBuilder } from "discord.js";

export async function RejectEmojiSuggestion(i: ButtonInteraction<"cached">) {

	if (!i.memberPermissions.has("ManageEmojisAndStickers"))
		return await i.reply({ content: 'Lo siento, no cuentas con los permisos necesarios para realizar esta acción.', ephemeral: true })

	const SuggestionEmbed = EmbedBuilder.from(i.message.embeds[0])
		.setFooter({ text: "RECHAZADO" })
		.setColor(Colors.Red)

	return await i.update({
		embeds: [SuggestionEmbed],
		components: []
	})
}