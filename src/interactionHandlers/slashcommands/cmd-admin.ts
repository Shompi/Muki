import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "../../types/index";
import { AdminAutoRoles } from "./subcommandHandlers/admin-roles";


export = {
	data: new SlashCommandBuilder()
		.setName("admin")
		.setDescription("Varios comandos de administrador")
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setDescriptionLocalization("en-US", "Admin commands")
		.setDMPermission(false)
		.addSubcommand(roles =>
			roles.setName("roles")
				.setDescription("Añade los roles que los miembros pueden añadirse")
				.setDescriptionLocalization('en-US', "Add the roles that members can add to themselves")
		),
	async execute(i) {

		const subcommand = i.options.getSubcommand();

		switch (subcommand) {
			case "roles":
				AdminAutoRoles(i)
		}

	}
} as SlashCommand;