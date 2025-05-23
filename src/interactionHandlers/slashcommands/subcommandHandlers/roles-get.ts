import { ActionRowBuilder, ButtonBuilder, ChatInputCommandInteraction, ComponentType, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "discord.js";
import type { Category, DatabaseRole } from "../../../types/index.ts";
import { CreateButtons } from "./utils/CreateCategoriesButton.ts";
import { DatabasePaths } from "../../../globals/paths.ts";

/* const RolesDatabase = await Deno.openKv(DatabasePaths.Roles)
const CategoriesDatabase = await Deno.openKv(DatabasePaths.RolesCategories) */

export async function GetRoles(i: ChatInputCommandInteraction<"cached">) {

	const { guild } = i;

	/* Get the available categories from the database and turn them into buttons */
	// const dbCategories = (await CategoriesDatabase.get([i.guildId])).value as Category[]

	/* 	if (!dbCategories || dbCategories.length === 0)
			return await i.reply({
				content: "El administrador aún no ha añadido ninguna categoria a la lista de roles.",
				ephemeral: true
			}) */


	/* 	const bCategorias = CreateButtons(dbCategories)
	
		const ButtonRow = new ActionRowBuilder<ButtonBuilder>().addComponents(bCategorias)
	
		const InitialResponse = await i.reply({
			content: "Escoge una categoria",
			ephemeral: true,
			components: [ButtonRow]
		}) */

	/* 	const iCategoria = await InitialResponse.awaitMessageComponent(
			{
				componentType: ComponentType.Button,
				time: 60_000,
				dispose: true
			}) */

	/* Get the roles from that category */

	/* const dbRoles = (await RolesDatabase.get([i.guildId])).value as DatabaseRole[] */

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	/* const RolesFromCategory = dbRoles.find(role => role.category.name === iCategoria.component.label)!.roles */

	/* Create the dropdown to select the roles from */

	/* 	const RolesActionRow = new ActionRowBuilder<StringSelectMenuBuilder>()
			.setComponents(
				new StringSelectMenuBuilder()
					.setMinValues(1)
					.setMaxValues(RolesFromCategory.length)
					.setCustomId('role-user-select')
					.setPlaceholder('Selecciona los roles...')
					.addOptions(
						RolesFromCategory.map(roleId => {
							const RoleObject = i.guild.roles.cache.get(roleId) ?? { name: "Rol eliminado", id: "0", }
							return new StringSelectMenuOptionBuilder()
								.setLabel(RoleObject.name)
								.setValue(RoleObject.id)
						})
					)
			) */

	/* 	const CategoryResponse = await iCategoria.update({
			content: 'Ahore, selecciona los roles que quieras desde el menú de abajo!',
			components: [RolesActionRow]
		})
	
		const SelectedRoles = await CategoryResponse.awaitMessageComponent({
			componentType: ComponentType.StringSelect,
			time: 60_000 * 2,
			dispose: true,
		}) */

	/* Add the roles to the member */
	/* 	await i.member.roles.add(SelectedRoles.values);
	
		return await SelectedRoles.update({
			content: `Se te han añadido los siguientes roles: **${SelectedRoles.values.map(roleId => guild.roles.cache.get(roleId)?.name).join(", ")}!**\nYa puedes cerrar este mensaje.`,
			components: []
		}) */
}