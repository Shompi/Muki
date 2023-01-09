import { ActivityType, Client, Events } from "discord.js"
import { ReadyEvent } from "../types/index"
import { ChangeProfilePicture } from "./utils/changeProfilePic"
import { EarthquakeMonitor } from "./utils/earthquakes"

export default {
	name: Events.ClientReady,
	once: true,
	earthquakeMonitor(client: Client) {
		setInterval(EarthquakeMonitor, 1000 * 60 * 5, client)
	},
	changeProfilePicture(client: Client) {
		setInterval(ChangeProfilePicture, 1000 * 60 * 60 * 12, client)
	},
	async execute(client: Client) {
		console.log(`${client.user?.username} is ready!`)

		client.user?.setActivity({
			name: "Estoy de vuelta",
			type: ActivityType.Watching
		})

		console.log("Initialized.")

		this.earthquakeMonitor(client)
		this.changeProfilePicture(client)
	},
} as ReadyEvent