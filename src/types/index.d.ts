import { BaseInteraction, ChatInputCommandInteraction, Client, Collection, CommandInteraction, PermissionsBitField, SlashCommandBuilder } from "discord.js"
type InteractionCreateFile = {
	name: string
	once: boolean
	async execute(i: BaseInteraction): Promise<unknown>
};

interface EventFile {
	name: string
	once: boolean
	async execute(...e: unknown): Promise<unknown>
}

interface ReadyEvent extends EventFile {
	earthquakeMonitor: (c: Client) => Promise<unknown>,
	changeProfilePicture: (c: Client) => Promise<unknown>
}

type SlashCommand = {
	data: SlashCommandBuilder
	permissions?: PermissionsBitField
	async execute(i: ChatInputCommandInteraction<"cached">): Promise<unknown>
}

interface DatabaseRole {
	category: {
		name: string
		emoji: string
	}
	roles: string[]
}

interface Category {
	name: string
	emoji?: string
}

declare module "discord.js" {
	interface Client {
		commands: Collection<string, SlashCommand>
	}
}