import { getVoiceConnection } from "@discordjs/voice";
import { EventFile } from "@myTypes/*";
import { Events, TextChannel, VoiceState } from "discord.js";

export default {
	name: Events.VoiceStateUpdate,
	once: false,
	async execute(oldState: VoiceState, newState: VoiceState) {

		const { client, guild } = newState

		const connection = getVoiceConnection(guild.id)
		if (!connection) return;

		// if there is no audiplayer created that means we are not playing any audio here.
		if (!guild.audioPlayer) return
		console.log('The guild does have an audio player');


		// if Muki is alone in the channel
		if (guild.members.me?.voice.channel?.members.size === 1) {
			console.log("There is only 1 member on the voice channel");

			const interactionChannel = guild.channels.cache.get(guild.queue?.channelId ?? "") as TextChannel | undefined
			const SadEmoji = client.emojis.cache.filter(emoji => emoji.name?.toLowerCase().includes('sad')).random()
			connection.disconnect()
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			return void await interactionChannel?.send({ content: `<@${newState.member?.id}> me dejaste sola en el canal... ${SadEmoji ?? ""}` })
		}
	}
} as EventFile