import { PermissionFlagsBits, SlashCommandBuilder } from "npm:discord.js@14.13.0"
import { type SlashCommandTemplate } from "../../types/index.ts"
import { AdminAutoRoles } from "./subcommandHandlers/admin-roles.ts"


const command: SlashCommandTemplate = {
	data: new SlashCommandBuilder()
		.setName("admin")
		.setDMPermission(false)
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

		const subcommand = i.options.getSubcommand()

		switch (subcommand) {
			case "roles":
				await AdminAutoRoles(i)
				break
		}

	}
}

export default command