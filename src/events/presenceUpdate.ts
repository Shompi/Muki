/* import { Presence, Activity, EmbedBuilder, type GuildMember, ActivityType, Events, GuildTextBasedChannel } from 'discord.js@latest'
import { getGameCoverByName } from "./utils/gameImages/index.ts"
import { EventFile } from '../types/index.ts'
import { DatabasePaths } from '../globals/paths.ts'
const LivestreamTimestamps = await Deno.openKv(DatabasePaths.LivestreamPresences)

const StreamerRole = "912096189443350548"
const StreamsChannel = "600159867239661578" */

// const LivestreamTimestamps = new keyv(DatabasePaths.LivestreamPresences, { namespace: 'livestreams' })




/* const Timeout = 1000 * 60 * 60 * 3

export default {
	name: Events.PresenceUpdate,
	once: false,
	async execute(_old, now) {

		if (now.member === null) return 
		
		if (now.activities.find(activity => activity.type === ActivityType.Streaming)) {
			await checkTwitchStream(now)
		}
	}
} satisfies EventFile<'presenceUpdate'>

async function checkTwitchStream(presence: Presence) {

	// Chequear que haya una actividad siendo stremeada
	const STREAMED_ACTIVITY = getLivestreamInfo(presence)

	if (!STREAMED_ACTIVITY) return
	if (!CheckMemberStreamerRole(presence.member!)) return


	let USER_TIMESTAMP = (await LivestreamTimestamps.get(["stream", presence.userId])).value as number
	let NEW_USER = false

	if (!USER_TIMESTAMP) {
		// Si el usuario no está lo agregamos
		await LivestreamTimestamps.set(["stream", presence.userId], Date.now())
		USER_TIMESTAMP = (await LivestreamTimestamps.get(['stream', presence.userId])).value as number
		NEW_USER = !NEW_USER
	}


	if (NEW_USER) {

		await sendLiveStream(presence)

	} else {
		// Revisar si han pasado las horas necesarias desde que el usuario comenzó a transmitir
		const TIMENOW = Date.now()

		const TIMEDIFF = TIMENOW - USER_TIMESTAMP
		if (TIMEDIFF >= Timeout) {
			await sendLiveStream(presence)
			// Update timestamp
			await LivestreamTimestamps.set(["stream", presence.userId], Date.now())
		} else return
	}
}

function CheckMemberStreamerRole(member: GuildMember) {
	return member.roles.cache.has(StreamerRole)
}

function getLivestreamInfo(presence: Presence) {
	return presence.activities.find(activity => activity.type === ActivityType.Streaming)
}

async function createEmbed(activity: Activity, member: GuildMember) {

	const gameImage = await getGameCoverByName(activity.state)

	const LiveEmbed = new EmbedBuilder()
		.setAuthor({
			name: `¡${member.displayName} ha comenzado a transmitir en ${activity.name}!`,
			url: activity.url ?? undefined
		})
		.setTitle(activity.details)
		.setColor(member.displayColor)
		.setThumbnail(member.user.displayAvatarURL({ size: 512 }))
		.setImage(gameImage)

	if (activity.url) {
		LiveEmbed.setDescription(`[-> Únete a la transmisión <-](${activity.url})`)
	}

	return LiveEmbed
}

async function sendLiveStream(presence: Presence) {
	const STREAMED_ACTIVITY = getLivestreamInfo(presence)

	const STREAM_CHANNEL = presence.client.channels.cache.get(StreamsChannel) as GuildTextBasedChannel

	await STREAM_CHANNEL.send({
		embeds: [await createEmbed(STREAMED_ACTIVITY!, presence.member!)]
	})
} */