import { AudioPlayerStatus } from "npm:@discordjs/voice";
import { ChatInputCommandInteraction } from "npm:discord.js@latest";

export async function PauseOrUnpauseSong(interaction: ChatInputCommandInteraction<'cached'>) {

	const { guild } = interaction

	if (guild.audioPlayer) {

		if (guild.audioPlayer.state.status === AudioPlayerStatus.Paused) {
			guild.audioPlayer.unpause()
			void await interaction.reply({ content: `▶️ ${interaction.member.displayName} ha reanudado la reproducción.` })

		} else {
			guild.audioPlayer.pause(true)
			void await interaction.reply({ content: `⏸️ ${interaction.member.displayName} ha pausado la reproducción.` })
		}

	} else {
		void await interaction.reply({ content: 'Esta guild no tiene un reproductor de audio creado. ', ephemeral: true })
	}
}