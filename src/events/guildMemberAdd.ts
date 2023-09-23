import { EventFile } from "../types/index.d.ts";
import { Events } from "npm:discord.js@14.13.0";
import { GenerateWelcomeImage } from "./utils/generate.ts";



export default {
	name: Events.GuildMemberAdd,
	once: false,
	async execute(member) {
		return; // This broke
		if (member.guild.id !== member.client.mainGuild.id) return;

		const defaultChannel = member.guild.systemChannel

		if (!defaultChannel) return

		return void defaultChannel.send({
			// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
			content: `¡Bienvenido al servidor ${member}!\nRecuerda asignarte roles en ${member.client.selfroles_channel}`,
			files: [await GenerateWelcomeImage(member)]
		})
	}
} satisfies EventFile<Events.GuildMemberAdd>