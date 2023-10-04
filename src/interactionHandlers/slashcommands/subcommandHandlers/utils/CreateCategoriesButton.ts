import { ButtonBuilder, ButtonStyle } from "npm:discord.js@14.13.0"
import { Category } from "../../../../types/index.ts"


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