import { MessageCommand } from '../types/index.d.ts';
import { EmbedBuilder } from 'npm:discord.js';
import util from "node:util"

const Command: MessageCommand = {
	name: 'eval',
	ownerOnly: true,
	async execute(message, args) {
		const code = args?.join(" ")

		if (!code || code.length === 0) return;

		const resultEmbed = new EmbedBuilder();
		const timestamp = Date.now();

		try {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
			let evaled = await eval(code) as string;

			if (typeof evaled !== "string")
				// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
				evaled = util.inspect(evaled)

			resultEmbed.setTitle(`⏳ ${Date.now() - timestamp}ms`)
				.setDescription(`\`\`\`js\n${clean(evaled)}\`\`\``);

			await message.channel.send({ embeds: [resultEmbed] });

		} catch (err) {

			resultEmbed.setTitle(`⏳ ${Date.now() - timestamp}ms`)
				.setDescription(`\`\`\`js\n${clean(err as string)}\`\`\``);

			await message.channel.send({ embeds: [resultEmbed] });
		}
	}
}

export default Command


const clean = (text: string) => {
	if (typeof (text) === "string")
		return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
	else
		return text;
}