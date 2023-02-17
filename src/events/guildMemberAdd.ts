import { EventFile } from "@myTypes/*";
import { Events, GuildMember } from "discord.js";
import { GenerateWelcomeImage } from "./utils/generate.js";



const event: EventFile = {
	name: Events.GuildMemberAdd,
	once: false,
	async execute(member: GuildMember) {
		const defaultChannel = member.guild.systemChannel

		if (!defaultChannel) return

		return void defaultChannel.send({
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			content: `¡Bienvenido al servidor ${member}!`,
			files: [await GenerateWelcomeImage(member)]
		})
	}
}

export default event