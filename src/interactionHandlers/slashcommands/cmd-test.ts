import { ActionRowBuilder, ChannelType, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../types/index";

export default {
	data: new SlashCommandBuilder()
		.setName("test")
		.setDescription("Comando de prueba"),
	async execute(interaction) {
		const channels = (await interaction.guild.channels.fetch()).filter(c => ![ChannelType.GuildCategory, ChannelType.GuildVoice].includes(c!.type))

		console.log(channels.map(channel => ({ name: channel?.name, type: channel?.type })))

		return await interaction.reply("Yo!")
	},


} as SlashCommand