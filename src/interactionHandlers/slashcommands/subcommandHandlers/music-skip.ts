import { AudioPlayerStatus } from "npm:@discordjs/voice";
import { ChatInputCommandInteraction, Colors, EmbedBuilder } from "npm:discord.js@latest";

export async function SkipCurrentSong(interaction: ChatInputCommandInteraction<'cached'>) {

	const { guild } = interaction

	if (!interaction.member.voice.channelId) {
		return await interaction.reply({ content: 'Debes estar conectado al canal de voz para usar este comando.' })
	}

	if (!guild.members.me?.voice.channelId)
		return await interaction.reply({ content: 'No estoy conectada a ningun canal de voz.' })

	if (interaction.member.voice.channelId !== guild.members.me.voice.channelId)
		return await interaction.reply({ content: 'Debes estar conectado al mismo canal de voz que yo.' })

	// Chequear que haya algo reproduciendose
	if (guild.audioPlayer?.state.status === AudioPlayerStatus.Playing) {
		guild.audioPlayer.stop(true)
		return await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setDescription(`**${interaction.user.username}** ha saltado la canción...`)
					.setColor(Colors.Blue)
					.setFooter({
						text: `⏩ Skip`,
						iconURL: interaction.user.displayAvatarURL({ size: 128 })
					})
			]
		})
	}
}