import { ActivityType, Client, Events, version } from "npm:discord.js"
import { ReadyEvent } from "../types/index.ts"
import { ChangeProfilePicture } from "./utils/changeProfilePic.ts"
import { EarthquakeMonitor } from "./utils/earthquakes.ts"

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

	execute(client: Client<true>) {
		// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
		console.log(`${client.user?.username} is ready!`)
		console.log('Cargando emojis...');
		client.loadEmojis()
		console.log('Emojis cargados!');
		console.log(`Versión de Discord.js: ${version}`);


		client.user?.setActivity({
			name: "Estoy de vuelta",
			type: ActivityType.Watching
		})

		this.earthquakeMonitor(client)
		this.changeProfilePicture(client)
	},
} as ReadyEvent