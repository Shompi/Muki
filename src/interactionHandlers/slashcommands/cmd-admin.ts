import { ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from "npm:discord.js@latest"
import { type SlashCommandTemplate } from "../../types/index.ts"
import { AdminAutoRoles } from "./subcommandHandlers/admin-roles.ts"

const subcommands = new Map<string, (i: ChatInputCommandInteraction<'cached'>) => void>()
	.set('roles', AdminAutoRoles)

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
	async execute(interaction) {

		const subcommand = subcommands.get(interaction.options.getSubcommand())

		return subcommand ? subcommand(interaction) : await interaction.reply({ content: 'Este comando no ha sido implementado.' })

	}
}

export default command