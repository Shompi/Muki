import { AutocompleteInteraction, BaseInteraction, ChatInputCommandInteraction, Client, Collection, Events, GuildTextBasedChannel, Message, SlashCommandBuilder } from "discord.js"

export type InteractionCreateFile = {
	name: string
	once: boolean
	execute(i: BaseInteraction): Promise<unknown>
};

export interface EventFile {
	name: Events
	once: boolean
	execute(...e: unknown[]): Promise<unknown>
}

export interface ReadyEvent extends EventFile {
	earthquakeMonitor: (c: Client) => unknown
	changeProfilePicture: (c: Client) => unknown
}
export interface DatabaseRole {
	category: {
		name: string
		emoji: string
	}
	roles: string[]
}
export interface Category {
	name: string
	emoji?: string
}

export interface SlashCommandTemplate {
	data: Partial<SlashCommandBuilder> & { name: string }
	permissions?: PermissionsBitField
	declare execute: (interaction: ChatInputCommandInteraction<"cached">) => Promise<unknown>
	declare autocomplete?: (interaction: AutocompleteInteraction) => Promise<unknown>
}

export interface MessageCommand {
	name: string,
	ownerOnly?: boolean,
	execute: (m: Message, args?: Array<string>) => Promise<unknown>
}
export interface MukiClient extends Client {
	commands: Collection<string, SlashCommandTemplate>
	messageCommands: Collection<string, MessageCommand>
	get suggestion_channel(): GuildTextBasedChannel
}

