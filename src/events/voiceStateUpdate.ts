import { AudioPlayerStatus, getVoiceConnection } from "@discordjs/voice";
import { EventFile } from "@myTypes/*";
import { Events, TextChannel, VoiceState } from "discord.js";

export default {
	name: Events.VoiceStateUpdate,
	once: false,
	execute(oldState: VoiceState, newState: VoiceState) {

		const { client, guild } = newState

		const connection = getVoiceConnection(guild.id)
		if (!connection) return;

		// if there is no audiplayer created that means we are not playing any audio here.
		if (!guild.audioPlayer) return
		console.log('The guild does have an audio player');


		// if Muki is alone in the channel
		if (guild.members.me?.voice.channel?.members.size === 1) {
			console.log("There is only 1 member on the voice channel");

			// Check if Muki is playing audio
			if (guild.audioPlayer.state.status === AudioPlayerStatus.Playing) {

				// We have to disconnect her
				console.log("Muki is playing audio");

				const connection = getVoiceConnection(guild.id)

				if (connection) {
					connection.disconnect()
					const interactionChannel = guild.channels.cache.get(guild.queue!.channelId) as TextChannel
					const SadEmoji = client.emojis.cache.filter(emoji => emoji.name?.toLowerCase().includes('sad')).random()
					// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
					void interactionChannel.send({ content: `<@${newState.member!.id}> me dejaste sola en el canal... ${SadEmoji ?? ""}` })
				}
			}
		}
		return
	}
} as EventFile