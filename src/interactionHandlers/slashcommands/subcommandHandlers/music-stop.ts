import { getVoiceConnection } from "npm:@discordjs/voice";
import { ChatInputCommandInteraction } from "npm:discord.js@14.13.0";

export async function StopPlayback(interaction: ChatInputCommandInteraction<'cached'>) {

	const { guild } = interaction

	if (!guild.members.me?.voice.channel)
		return await interaction.reply({ content: `¿Que?\nNo estoy reproduciendo música ${guild.client.util.emoji.question}` })


	await interaction.reply({ content: `${guild.client.util.emoji.thumbsup}` })

	const connection = getVoiceConnection(guild.id)
	guild.audioPlayer?.stop()
	return connection?.disconnect()
}