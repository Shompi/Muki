import { ActivityType, Client, Events } from "discord.js";
import { ReadyEvent } from "../types/index";
import { EarthquakeMonitor } from "./utils/earthquakes.js";

export default {
	name: Events.ClientReady,
	once: true,
	earthquakeMonitor(client: Client) {
		setInterval(EarthquakeMonitor, 60 * 1_000 * 5, client)
	},
	async execute(client: Client) {
		console.log(`${client.user?.username} is ready!`);

		client.user?.setActivity({
			name: "Estoy de vuelta",
			type: ActivityType.Watching
		});

		console.log("Initialized.");

		this.earthquakeMonitor(client);


	},
} as ReadyEvent