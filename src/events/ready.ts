import { ActivityType, ChannelType, Client, Events, TextChannel } from "npm:discord.js@14.13.0"
import { ReadyEvent } from "@myTypes/index"
import { ChangeProfilePicture } from "./utils/changeProfilePic.js"
import { EarthquakeMonitor } from "./utils/earthquakes.js"

interface BasicDataPostRequest {
	username: string
	uptime: number
	avatar: string
	guilds: {
		name: string
		member_count: number
		iconURL?: string
	}[],
	commands: {
		name: string;
		description: string;
		options: {
			name: string;
			description: string;
		}[];
	}[];
	user_count: number
	messages_in_cache: number
}

const guildIconDefault = "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Question_mark_%28black%29.svg/800px-Question_mark_%28black%29.svg.png"

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
	async sendBasicData(client: Client<true>) {

		// Calculations here pls

		const application = await client.application.fetch()

		// Message Count (Apromixate)
		const messagesCount = client.channels.cache.map(c => c.isTextBased() ? c.messages.cache.size : 0).reduce((ac, c) => ac + c, 0)


		setInterval(() => {
			fetch("http://localhost:3000/api/muki", {
				method: 'POST',
				headers: {
					"secret-token": "1234",
					"Content-Type": "application/json"
				},
				body: JSON.stringify({
					username: client.user.username,
					uptime: client.uptime,
					avatar: client.user.displayAvatarURL({ size: 512 }),
					guilds: client.guilds.cache.map(guild => ({ name: guild.name, member_count: guild.memberCount, iconURL: guild.iconURL({ size: 512 }) ?? guildIconDefault })),
					user_count: client.users.cache.size,
					messages_in_cache: messagesCount,
					commands: application.commands.cache.map(command => ({
						name: command.name,
						description: command.description,
						options: command.options.map(option => ({ name: option.name, description: option.description }))
					})),

				} satisfies BasicDataPostRequest)
			}).then((response) => {
				return response.json()
			}).then(data => {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
				console.log(data.message)
			}).catch(() => null)
		}, 10000)
	},
	execute(client: Client<true>) {
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