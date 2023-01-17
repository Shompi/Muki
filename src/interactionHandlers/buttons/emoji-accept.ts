import { ButtonInteraction, Colors, EmbedBuilder } from "discord.js";

export async function AcceptEmojiSuggestion(i: ButtonInteraction<"cached">) {

	if (!i.memberPermissions.has("ManageEmojisAndStickers")) {
		return await i.reply({ content: 'Lo siento, no tienes los permisos necesarios para realizar esta acción.', ephemeral: true })
	}

	const SuggestionEmbed = EmbedBuilder.from(i.message.embeds[0])
		.setFooter({ text: 'ACEPTADO' })
		.setColor(Colors.Green)

	await i.update({
		components: [],
		embeds: [SuggestionEmbed]
	})

	return await i.guild.emojis.create({
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		attachment: i.message.attachments.first()!.url,
		name: i.message.content.split(" ")[1],
		reason: `Sugerido por ${i.message.content.split(" ")[0]}`
	})
}