import { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from "@discordjs/builders";
import { ChatInputCommandInteraction, ComponentType } from "discord.js";

export async function RemoveSelfRoles(i: ChatInputCommandInteraction<"cached">) {

	const MemberRoles = i.member.roles.cache

	const Row = new ActionRowBuilder<StringSelectMenuBuilder>()
		.setComponents(
			new StringSelectMenuBuilder()
				.setCustomId('roles-self-remove')
				.setMaxValues(MemberRoles.size)
				.setMinValues(1)
				.setPlaceholder('Selecciona los roles...')
				.setOptions(
					MemberRoles.sort((roleA, roleB) => roleB.position - roleA.position).map(role => new StringSelectMenuOptionBuilder()
						.setLabel(role.name)
						.setValue(role.id)
					)
				)
		)

	const InitialReply = await i.reply({
		content: 'Selecciona los roles que quieres quitarte desde el menú de abajo',
		ephemeral: true,
		components: [Row]
	})
	try {


		const SelectInteraction = await InitialReply.awaitMessageComponent({
			componentType: ComponentType.StringSelect,
			dispose: true,
			time: 120_000
		})

		await SelectInteraction.deferUpdate()

		const SelectedRoles = SelectInteraction.values

		await i.member.roles.remove(SelectedRoles);

		await SelectInteraction.editReply({
			content: `Se te han quitado los siguientes roles: **${SelectedRoles.map(id => MemberRoles.get(id)?.name).join(", ")}!**\nYa puedes cerrar este mensaje.`,
			components: []
		})

	} catch (e) {
		console.log(e);
		return await i.followUp("La interacción ha sido cancelada.")

	}

}