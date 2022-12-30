import { ActionRowBuilder, ButtonBuilder, ButtonStyle, ChatInputCommandInteraction, codeBlock, Colors, ComponentType, EmbedBuilder, ModalBuilder, RoleSelectMenuBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
import Keyv from "keyv";
import { Category, DatabaseRole } from "muki";
import { CreateButtons } from "./utils/CreateCategoriesButton.js";
const RolesDatabase = new Keyv("sqlite://db/roles.sqlite")
const CategoriesDatabase = new Keyv("sqlite://db/roles-categories.sqlite")
/**
 * @description This is the command to **set** the roles that members are able to self add
 */
export default async function AdminAutoRoles(i: ChatInputCommandInteraction<'cached'>) {

	/* Prompt the user to choose a category, the category can be an existing one or a new one */

	const dbCategories: Category[] = await CategoriesDatabase.get(i.guildId) ?? []

	const RoleCategoriesRow = new ActionRowBuilder<ButtonBuilder>()
		.setComponents(
			CreateButtons(dbCategories)
		)

	const bNewCategory = new ButtonBuilder()
		.setLabel("Nueva")
		.setEmoji("➕")
		.setCustomId('category-new')
		.setStyle(ButtonStyle.Secondary)

	const bDeleteCategory = new ButtonBuilder()
		.setLabel('Borrar')
		.setEmoji("❌")
		.setStyle(ButtonStyle.Danger)
		.setCustomId('category-delete')
	const RoleOptionsRow = new ActionRowBuilder<ButtonBuilder>().setComponents(bNewCategory, bDeleteCategory)

	const initialReply = await i.reply({
		ephemeral: true,
		content: `Presiona uno de los botones para añadir roles a una categoria existente o añadir una nueva categoría:`,
		components: [RoleCategoriesRow, RoleOptionsRow]
	})

	try {

		const PressedButton = await initialReply.awaitMessageComponent({
			componentType: ComponentType.Button,
			dispose: true,
			time: 60_000
		})

		if (PressedButton.customId === "category-new") {

			if (dbCategories.length >= 5) {
				return await PressedButton.reply({
					content: 'No puedes añadir más categorias.',
					ephemeral: true
				})
			}

			const CategoryModal = new ModalBuilder()
				.setCustomId('modal-role-setup')
				.setTitle('Roles Setup')
				.setComponents(
					new ActionRowBuilder<TextInputBuilder>()
						.addComponents(
							new TextInputBuilder()
								.setCustomId('modal-role-category')
								.setLabel("Nombre de la categoria")
								.setRequired(true)
								.setMaxLength(50)
								.setMinLength(1)
								.setPlaceholder("Juegos")
								.setStyle(TextInputStyle.Short)
						),
					new ActionRowBuilder<TextInputBuilder>()
						.addComponents(
							new TextInputBuilder()
								.setCustomId('modal-role-emoji')
								.setLabel("Emoji")
								.setRequired(false)
								.setMaxLength(8)
								.setMinLength(1)
								.setPlaceholder("🎮")
								.setStyle(TextInputStyle.Short)
						)
				)

			await PressedButton.showModal(CategoryModal)

			const ModalSubmition = await PressedButton.awaitModalSubmit({
				time: 60_000,
				dispose: true,
				filter: (i) => i.customId === 'modal-role-setup'
			})

			await PressedButton.deleteReply()

			const CategoryName = ModalSubmition.fields.getTextInputValue('modal-role-category')
			const CategoryEmoji = ModalSubmition.fields.getTextInputValue('modal-role-emoji')

			if (CategoryName === "new") {
				return await ModalSubmition.reply({
					content: 'El nombre de la categoría no puede ser "new". Deberás volver a usar este comando y especificar otro nombre.',
					ephemeral: true
				})
			}

			/* Show the admin a dropdown menu with roles to select (multi selection) */

			const RolesSelectMenu = new ActionRowBuilder<RoleSelectMenuBuilder>()
				.addComponents(
					new RoleSelectMenuBuilder()
						.setCustomId('select-admin-roles')
						.setMaxValues(i.guild.roles.cache.size > 25 ? 25 : i.guild.roles.cache.size)
						.setMinValues(1)
						.setPlaceholder("Selecciona los roles...")
				)

			const ModalResponse = await ModalSubmition.reply({
				content: `Escoge los roles que quieres agregar a la categoría **${CategoryName}** en el menú de abajo (**Max: 25**)`,
				ephemeral: true,
				components: [RolesSelectMenu]
			})

			const SelectedRoles = await ModalResponse.awaitMessageComponent({
				componentType: ComponentType.RoleSelect,
				time: 60_000 * 5,
				dispose: true
			})

			const dbRoles: DatabaseRole[] = await RolesDatabase.get(i.guildId) ?? []

			dbRoles.push({ category: { name: CategoryName, emoji: CategoryEmoji ?? "" }, roles: SelectedRoles.values })

			await RolesDatabase.set(i.guildId, dbRoles)
			await CategoriesDatabase.set(i.guildId, [{ name: CategoryName, emoji: CategoryEmoji }])

			const RolesAddedEmbed = new EmbedBuilder()
				.setTitle(`✅ Se creó la categoría ${CategoryName} con éxito!`)
				.setDescription(`> **Roles añadidos**: \n${codeBlock(SelectedRoles.values.map(roleId => i.guild.roles.cache.get(roleId)?.name).join(", "))}`)
				.setColor(Colors.Blue)
				.setFooter({ text: "Ya puedes cerrar este mensaje" })

			return await SelectedRoles.update({
				embeds: [RolesAddedEmbed],
				components: []
			})
		}

		if (PressedButton.customId === "category-delete") {

			/** Delete a category */

			await PressedButton.update({
				content: 'Elige la categoría que quieres eliminar.',
				components: [RoleCategoriesRow]
			})

			const SelectedCategory = await PressedButton.message.awaitMessageComponent({
				componentType: ComponentType.Button,
				dispose: true,
				time: 15_000,
			})

			const CategoryToDelete = SelectedCategory.component.label!

			await DeleteCategory(CategoryToDelete, i.guildId);

			return await SelectedCategory.update({
				content: `La categoría ${CategoryToDelete} ha sido eliminada!`,
				components: []
			})
		}

		/** Whatever button it is, it is an existing category */
		const SelectedCategory = PressedButton.component.label

		const dbRoles: DatabaseRole[] = await RolesDatabase.get(i.guildId)

		/** The roles that are on the database */
		const Roles = dbRoles.find(role => role.category.name === SelectedCategory)

		if (!Roles) return await PressedButton.update({
			content: 'Al parecer esta categoría no tiene roles. Ejecuta el comando nuevamente, prueba eliminando la categoría y creandola de nuevo.',
			components: []
		})

		if (Roles.roles.length > 25) return await PressedButton.update({
			content: 'Esta categoría ya tiene 25 roles, no puedes añadir más.',
			components: []
		})


		const RoleSelectMenuRow = new ActionRowBuilder<RoleSelectMenuBuilder>()
			.setComponents(
				new RoleSelectMenuBuilder()
					.setCustomId('role-admin-select-menu')
					.setPlaceholder('Selecciona los roles...')
					.setMaxValues(i.guild.roles.cache.size > 25 ? 25 : i.guild.roles.cache.size)
					.setMinValues(1)
			)

		await PressedButton.update({
			content: '',
			components: [RoleSelectMenuRow]
		})

		/** Show the role select menu so the admin can add roles */
		const RoleSelectInteraction = await PressedButton.message.awaitMessageComponent({
			componentType: ComponentType.RoleSelect,
			time: 60_000 * 5,
			dispose: true,
		})

		const SelectedRoles = RoleSelectInteraction.values

		/** The final role list, removing dupes */
		const RolesConcatenated = Roles.roles.concat(SelectedRoles)
		const UniqueRoles = [...new Set(RolesConcatenated)]

		/** Replace the old roles with the new ones */
		const index = dbRoles.findIndex(role => role.category.name === SelectedCategory)
		dbRoles[index].roles = UniqueRoles

		/** Save the new list in the database */
		await RolesDatabase.set(i.guildId, dbRoles)

		const SuccessEmbed = new EmbedBuilder()
			.setTitle(`✅ Los roles fueron añadidos con exito!`)
			.setDescription(`La categoría ${SelectedCategory} ahora tiene **${UniqueRoles.length} / 25** roles!`)
			.setColor(Colors.Blue)

		return await RoleSelectInteraction.update({
			embeds: [SuccessEmbed],
			components: []
		})

	} catch (e) {

		console.error(e);
		return await i.followUp({
			content: 'El comando ha sido cancelado.',
			ephemeral: true
		})
	}
}

async function DeleteCategory(Category: string, guildId: string) {

	const dbCategories = await CategoriesDatabase.get(guildId) as Category[]

	const FilteredCategories = dbCategories.filter(cat => cat.name !== Category)

	await CategoriesDatabase.set(guildId, FilteredCategories)
	console.log(`La categoría ${Category} fue quitada de la lista exitosamente.`)

	const dbRoles: DatabaseRole[] = await RolesDatabase.get(guildId)

	const FilteredRoles = dbRoles.filter(roles => roles.category.name !== Category)

	await RolesDatabase.set(guildId, FilteredRoles)
	console.log(`Los roles de la categoría ${Category} fueron eliminados con exito`);

	return true
}