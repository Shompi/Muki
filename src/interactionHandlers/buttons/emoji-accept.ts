import { ButtonInteraction, Colors, EmbedBuilder } from "npm:discord.js@14.13.0";

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