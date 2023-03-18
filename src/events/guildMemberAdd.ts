import { EventFile } from "@myTypes/*";
import { Events, GuildMember } from "discord.js";
import { GenerateWelcomeImage } from "./utils/generate.js";



const event: EventFile = {
	name: Events.GuildMemberAdd,
	once: false,
	async execute(member: GuildMember) {
		if (member.guild.id !== member.client.mainGuild.id) return;

		const defaultChannel = member.guild.systemChannel

		if (!defaultChannel) return

		return void defaultChannel.send({
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			content: `¡Bienvenido al servidor ${member}!\nRecuerda asignarte roles en ${member.client.selfroles_channel}`,
			files: [await GenerateWelcomeImage(member)]
		})
	}
}

export default event