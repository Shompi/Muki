import { getVoiceConnection } from "@discordjs/voice";
import type { EventFile } from "../types/index.ts";
import { Events, TextChannel, VoiceState } from "discord.js";

export default {
	name: Events.VoiceStateUpdate,
	once: false,
	async execute(_oldState: VoiceState, newState: VoiceState) {

		const { client, guild } = newState

		const connection = getVoiceConnection(guild.id)
		if (!connection) return;

		// if Muki is alone in the channel
		if (guild.members.me?.voice.channel?.members.size === 1) {
			console.log("There is only 1 member on the voice channel");

			const interactionChannel = guild.channels.cache.get(guild.queue?.channelId ?? "") as TextChannel | undefined
			const SadEmoji = client.util.emoji.sad
			connection.destroy()

			return void await interactionChannel?.send({ content: `<@${newState.member?.id}> me dejaste sola en el canal... ${SadEmoji ?? ""}` })
		}
	}
} satisfies EventFile<'voiceStateUpdate'>