import { EmbedBuilder } from "npm:discord.js@14.13.0";
import { MessageCommand } from "../types";

const Command: MessageCommand = {
	name: 'test',
	ownerOnly: true,
	async execute(msg, args) {

		return void await msg.reply({ embeds: [new EmbedBuilder().setDescription('\u200b').setColor('Random').setTitle('test')] })
	}
}

export default Command