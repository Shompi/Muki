import { Listener } from 'discord-akairo';
import { type VoiceState, type Activity, EmbedBuilder, type TextChannel, ActivityType, GuildTextBasedChannel } from 'discord.js';
import { getGameCoverByName } from '../../GameImages/index';
const Timeouts = new Set();


class InteractionEvent extends Listener {
	constructor() {
		super('voiceStateUpdate', {
			emitter: 'client',
			event: 'voiceStateUpdate'
		});
	}

	async exec(oldState: VoiceState, newState: VoiceState) {

		return; // Disabling this for now, may come back later.

		if (newState.member === null)
			return;

		if (newState.guild.id !== "537484725896478733" || Timeouts.has(newState.member?.id)) return;

		if (oldState.streaming) return;
		if (newState.streaming && !oldState.streaming) {

			// Obtener el juego o actividad siendo stremeada, usaremos "find" para encontrar una activiad en estado "PLAYING"
			/**@type {Activity} */

			const activity = newState.member?.presence?.activities?.find(activity => activity.type === ActivityType.Playing);

			const thumbnailUrl = await getGameCoverByName(activity?.name ?? 'Actividad Desconocida');

			const liveEmbed = new EmbedBuilder()
				.setTitle(`${newState.member!.user.tag} ha comenzado a transmitir en ${newState.channel!.name}!`)
				.setDescription(`**${activity?.name ?? ""} - ${activity?.state ?? ""}**`)
				.setThumbnail(newState.member!.displayAvatarURL({ size: 512 }))
				.setImage(thumbnailUrl)
				.setColor(newState.member!.displayColor);

			// TODO: This part should probably be get by a database.
			const streamingChannel = newState.client.channels.cache.get("") as GuildTextBasedChannel;

			await streamingChannel.send({ embeds: [liveEmbed] });

			Timeouts.add(newState.member!.id);

			setTimeout(() => {
				Timeouts.delete(newState.member!.id);
			}, 1000 * 60 * 30);
		}
	}
}


module.exports = InteractionEvent;