console.log("Presence Update Event Loaded");

import { type Presence, Activity, EmbedBuilder, type GuildMember, ActivityType, Snowflake } from 'discord.js'
import { Listener } from 'discord-akairo'
import keyv from 'keyv'
import { getGameCoverByName } from '../../GameImages/'

interface GuildStreamConfigs {
	roleId: Snowflake
	channelId: Snowflake
	enabled: boolean
}

const LIVESTREAMS_TIMESTAMPS = new keyv('sqlite://db/database.sqlite', { namespace: 'livestreams' })
const StreamsConfigPerGuild = new keyv('sqlite://db/StreamsConfigs.sqlite', { namespace: 'streamsConfig' })
const HOURSLIMIT = 1000 * 60 * 60 * 3

export default class PresenceUpdateListener extends Listener {
	hasTimers: boolean
	checkTwitchStream: (p: Presence, old: Presence) => Promise<void>
	constructor() {
		super('presenceUpdate', {
			emitter: 'client',
			event: 'presenceUpdate'
		})

		this.hasTimers = false

		this.checkTwitchStream = async (presence) => {

			const checkGuildConfigs = async (guildId: Snowflake) => {

				const configs = await StreamsConfigPerGuild.get(guildId) as GuildStreamConfigs

				if (!configs) return false

				if (!configs.enabled) return false

				return true
			}

			// Chequear que haya una actividad siendo stremeada
			const STREAMED_ACTIVITY = getLivestreamInfo(presence)

			if (!STREAMED_ACTIVITY) return

			if (!(await checkGuildConfigs(presence.guild!.id))) return
			if (!(await memberHasStreamerRole(presence.member!))) return

			let USER_TIMESTAMP = await LIVESTREAMS_TIMESTAMPS.get(presence.user!.id).catch(() => null) as number
			let NEW_USER = false

			if (!USER_TIMESTAMP) {
				// Si el usuario no está lo agregamos
				await LIVESTREAMS_TIMESTAMPS.set(presence.user!.id, Date.now())
				USER_TIMESTAMP = await LIVESTREAMS_TIMESTAMPS.get(presence.user!.id) as number
				NEW_USER = !NEW_USER
			}


			if (NEW_USER) {

				await sendLiveStream(presence)

			} else {
				// Revisar si han pasado las horas necesarias desde que el usuario comenzó a transmitir
				const TIMENOW = Date.now()

				const TIMEDIFF = TIMENOW - USER_TIMESTAMP
				if (TIMEDIFF >= HOURSLIMIT) {
					await sendLiveStream(presence)
					// Update timestamp
					await LIVESTREAMS_TIMESTAMPS.set(presence.user!.id, Date.now())
				} else return
			}
		}
	}

	async exec(old: Presence, now: Presence) {
		/*Code Here*/

		/* Esto solo funcionará para exiliados */
		if (now.guild?.id === '537484725896478733') {
			await this.checkTwitchStream(now, old)
		}
	}
}

async function memberHasStreamerRole(member: GuildMember) {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const StreamerRoleId = await StreamsConfigPerGuild.get(member.guild.id).then((configs: GuildStreamConfigs) => configs ? configs.roleId : "0000")

	return member.roles.cache.has(StreamerRoleId)
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
	const streamChannelId = await StreamsConfigPerGuild.get(presence.guild?.id ?? "0000").then((configs: GuildStreamConfigs) => configs ? configs.channelId : "0000")

	if (!streamChannelId) return

	const STREAM_CHANNEL = presence.client.channels.cache.get(streamChannelId)
	if (STREAM_CHANNEL?.isTextBased()) {
		await STREAM_CHANNEL.send({
			embeds: [await createEmbed(STREAMED_ACTIVITY!, presence.member!)]
		})
	}
}