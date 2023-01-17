import { ChatInputCommandInteraction } from "discord.js";

export async function BanMember(interaction: ChatInputCommandInteraction<"cached">) {

	const args = {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		target: interaction.options.getUser('user')!,
		secondsToDeleteMessages: interaction.options.getInteger('dias') ?? undefined,
		reason: interaction.options.getString('razon') ?? undefined
	}

	const Member = await interaction.guild.members.fetch(args.target).catch(() => null)

	if (!Member) {
		// If the member is not in the guild we can assume is just a haxban, or something like that.
		await interaction.deferReply({ ephemeral: true })

		await interaction.guild.bans.create(args.target, { deleteMessageSeconds: args.secondsToDeleteMessages, reason: args.reason })

		return await interaction.editReply({
			content: '✅ El usuario ha sido agregado a la lista de bans exitosamente!'
		})
	}

	if (Member.bannable) {
		await interaction.deferReply({ ephemeral: true })
		await Member.ban({
			deleteMessageSeconds: args.secondsToDeleteMessages,
			reason: args.reason
		})

		return await interaction.editReply({
			content: `✅ El miembro ${Member.user.tag} ha sido baneado exitosamente!`
		})
	} else {
		await interaction.reply({
			ephemeral: true,
			content: '❌ Lo siento, este miembro no puede ser baneado por mi.'
		})
	}
}