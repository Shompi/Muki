import { ActivityType, Client, Events } from "discord.js"
import { ReadyEvent } from "../types/index"
import { ChangeProfilePicture } from "./utils/changeProfilePic"
import { EarthquakeMonitor } from "./utils/earthquakes"

export default {
	name: Events.ClientReady,
	once: true,
	earthquakeMonitor(client: Client) {
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		setInterval(EarthquakeMonitor, 1000 * 60 * 5, client)
	},
	changeProfilePicture(client: Client) {
		// eslint-disable-next-line @typescript-eslint/no-misused-promises
		setInterval(ChangeProfilePicture, 1000 * 60 * 60 * 12, client)
	},
	execute(client: Client) {
		// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
		console.log(`${client.user?.username} is ready!`)

		client.user?.setActivity({
			name: "Estoy de vuelta",
			type: ActivityType.Watching
		})

		this.earthquakeMonitor(client)
		this.changeProfilePicture(client)
	},
} as ReadyEvent