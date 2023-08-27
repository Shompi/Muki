import { ActivityType, Client, Events } from "discord.js"
import { ReadyEvent } from "@myTypes/index"
import { ChangeProfilePicture } from "./utils/changeProfilePic.js"
import { EarthquakeMonitor } from "./utils/earthquakes.js"

export default {
	name: Events.ClientReady,
	once: true,
	earthquakeMonitor(client: Client) {
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		setInterval(EarthquakeMonitor, 1000 * 60 * 1, client)
	},
	changeProfilePicture(client: Client) {
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		setInterval(ChangeProfilePicture, 1000 * 60 * 60 * 12, client)
	},
	sendBasicData(client) {
		setInterval(() => {
			fetch("http://localhost/api/muki", {
				method: 'POST',
				headers: {
					"secret-token": "1234",
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					username: client.user?.username,
					uptime: client.uptime,
					avatar: client.user?.avatarURL({ size: 512 }),
					guilds: client.guilds.cache.map(guild => ({ name: guild.name, member_count: guild.memberCount, iconURL: guild.iconURL({ size: 512 }) })),
					user_count: client.users.cache.size,
				})
			}).then((response) => {
				return response.json()
			}).then(data => {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				console.log(data.message)
			}).catch(() => null)
		}, 10000)
	},
	execute(client: Client) {
		// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
		console.log(`${client.user?.username} is ready!`)
		console.log('Cargando emojis...');
		client.loadEmojis()
		console.log('Emojis cargados!');

		client.user?.setActivity({
			name: "Estoy de vuelta",
			type: ActivityType.Watching
		})

		this.earthquakeMonitor(client)
		this.changeProfilePicture(client)
		this.sendBasicData(client)
	},
} as ReadyEvent