import { ChatInputCommandInteraction } from "discord.js";

export async function KickMember(interaction: ChatInputCommandInteraction<'cached'>) {

	const args = {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		target: interaction.options.getUser('user')!,
		reason: interaction.options.getString('razon')
	}

	const Member = await interaction.guild.members.fetch(args.target).catch(() => null)

	if (!Member) return await interaction.reply({
		content: 'El miembro ya no está en este servidor.',
		ephemeral: true
	})

	if (Member.kickable) {
		await interaction.deferReply({ ephemeral: true })

		await Member.kick(args.reason ?? undefined)

		return await interaction.editReply({
			content: `✅ El miembro ${Member.user.tag} ha sido expulsado.`
		})
	} else {

		return await interaction.reply({
			content: '❌ Lo siento, no puedo expulsar a este miembro.',
			ephemeral: true
		})
	}
}