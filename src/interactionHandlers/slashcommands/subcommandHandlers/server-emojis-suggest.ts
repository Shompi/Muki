import { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, Colors, EmbedBuilder } from "discord.js";

export async function SuggestGuildEmoji(interaction: ChatInputCommandInteraction<'cached'>) {

	await interaction.deferReply({ ephemeral: true })
	const client = interaction.client
	const SuggestionsChannel = client.suggestion_channel

	if (!SuggestionsChannel)
		return await interaction.editReply({ content: 'No hay canal de sugerencias habilitado en este servidor, por favor intentalo más tarde.' })

	const AcceptButton = new ButtonBuilder()
		.setCustomId("emoji-accept")
		.setStyle(ButtonStyle.Success)
		.setEmoji("✅")
		.setLabel("Aceptar")

	const RejectButton = new ButtonBuilder()
		.setCustomId("emoji-reject")
		.setStyle(ButtonStyle.Danger)
		.setEmoji("❌")
		.setLabel("Rechazar")

	const Actions = new ActionRowBuilder<ButtonBuilder>()
		.setComponents([AcceptButton, RejectButton])


	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const Imagen = interaction.options.getAttachment('imagen')!
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const Nombre = interaction.options.getString('nombre')!.replace(/\s+/g, "_").toLowerCase()
	if (!Imagen.contentType)
		return await interaction.editReply({ content: 'No pude comprobar el tipo de este archivo, por favor asegurate de subir una imagen válida, con extension **jpg, jpeg, png o gif**.' })

	if (!["image/jpg", "image/png", "image/jpeg", "image/gif"].includes(Imagen.contentType)) {
		return await interaction.editReply({
			content: 'El archivo que has subido no es de tipo imagen. Solo puedes subir archivos de tipo **jpeg, jpg, png o gif**.'
		})
	}

	if (Nombre.length < 3)
		return await interaction.editReply({ content: 'Lo siento, el nombre del emoji debe contener al menos 3 letras.' })

	if (Nombre.length > 30)
		return await interaction.editReply({ content: 'Lo siento, el nombre del emoji excede el limite de letras.' })

	const NewImage = new AttachmentBuilder(Imagen.url)

	await SuggestionsChannel.send({
		content: `${interaction.user.username} ${Nombre}`,
		components: [Actions],
		embeds: [
			new EmbedBuilder()
				.setDescription(`Enviado por: \`${interaction.user.username}\`\nNombre del emoji: \`${Nombre}\``)
				.setFooter({ text: "PENDIENTE" })
				.setColor(Colors.Blurple)
		],
		files: [NewImage]
	})

	return await interaction.editReply({
		content: 'Tu sugerencia de Emoji ha sido enviada, ¡esperemos que sea aceptada! 👀',
		embeds: [new EmbedBuilder().setTitle(Nombre).setThumbnail(Imagen.url).setColor(interaction.member.displayColor)]
	})
}