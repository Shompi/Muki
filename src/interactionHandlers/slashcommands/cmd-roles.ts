import { SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "@myTypes/index";
import { GetRoles } from "./subcommandHandlers/roles-get.js";
import { RemoveSelfRoles } from "./subcommandHandlers/roles-remove.js";
export default {
	data: new SlashCommandBuilder()
		.setName("roles")
		.setDMPermission(false)
		.setDescription("Comandos para añadirte o quitarte")
		.setDescriptionLocalization("en-US", "Commands to add or remove roles from you")
		.addSubcommand(add =>
			add.setName("añadir")
				.setNameLocalization('en-US', "get")
				.setDescription("Añadete más roles")
				.setDescriptionLocalization("en-US", "Add yourself some roles!")

		)
		.addSubcommand(remove =>
			remove.setName("quitar")
				.setNameLocalization('en-US', "remove")
				.setDescription("Quitate los roles que quieras con este comando!")
				.setDescriptionLocalization("en-US", "Remove all the roles you want with this command!")
		),
	async execute(i) {

		const subcommand = i.options.getSubcommand(true)
		console.log(subcommand);

		if (subcommand === 'añadir')
			return await GetRoles(i)

		if (subcommand === 'quitar')
			return await RemoveSelfRoles(i)

	},
} as SlashCommand;