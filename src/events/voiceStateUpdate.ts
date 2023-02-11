import { AudioPlayerStatus } from "@discordjs/voice";
import { EventFile } from "@myTypes/*";
import { Events, VoiceState } from "discord.js";

export default {
	name: Events.VoiceStateUpdate,
	once: false,
	execute(oldState: VoiceState, newState: VoiceState) {

		const { client: muki, channel, guild } = newState

		// if there is no audiplayer created that means we are not playing any audio here.
		if (!guild.audioPlayer) return

		// if Muki is alone in the channel
		if (channel?.members.size === 1 && channel?.members.has(muki.user.id)) {

			// Check if Muki is playing audio
			if (guild.audioPlayer.state.status === AudioPlayerStatus.Playing) {
				// We have to disconnect her
				

			}
		}
		return
	}
} as EventFile