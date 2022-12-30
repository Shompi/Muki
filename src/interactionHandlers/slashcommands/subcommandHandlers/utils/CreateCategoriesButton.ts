import { ButtonBuilder, ButtonStyle } from "discord.js"
import { Category } from "../../../../types/index"


export function CreateButtons(categories?: Category[]) {

	if (!categories || categories.length === 0) {
		return [
			new ButtonBuilder()
				.setCustomId('category-null')
				.setLabel("-")
				.setDisabled(true)
				.setStyle(ButtonStyle.Primary)
		]
	}

	const Buttons: ButtonBuilder[] = []


	for (const category of categories) {
		const button = new ButtonBuilder()
			.setCustomId(`category-${category.name.toLowerCase()}`)
			.setLabel(category.name)
			.setStyle(ButtonStyle.Primary)

		if (category.emoji)
			button.setEmoji(category.emoji)

		Buttons.push(button)
	}

	return Buttons
}