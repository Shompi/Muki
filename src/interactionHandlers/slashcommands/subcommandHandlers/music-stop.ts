import { getVoiceConnection } from "@discordjs/voice";
import { ChatInputCommandInteraction } from "discord.js";

export async function StopPlayback(interaction: ChatInputCommandInteraction<'cached'>) {

	const { guild } = interaction

	if (!guild.members.me?.voice.channel)
		return await interaction.reply({ content: `¿Que?\nNo estoy reproduciendo música ${guild.client.util.emoji.question}` })


	await interaction.reply({ content: `${guild.client.util.emoji.thumbsup}` })

	const connection = getVoiceConnection(guild.id)
	guild.audioPlayer?.stop()
	return connection?.disconnect()
}