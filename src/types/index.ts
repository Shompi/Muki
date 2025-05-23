import { AudioPlayer } from "@discordjs/voice";
import { AutocompleteInteraction, BaseInteraction, ChatInputCommandInteraction, Client, ClientEvents, Collection, Events, GuildTextBasedChannel, Message, PermissionsBitField, SlashCommandBuilder, Snowflake } from "discord.js"

export type InteractionCreateFile = {
	name: string
	once: boolean
	execute(i: BaseInteraction): Promise<unknown>
};

export interface EventFile<Event extends keyof ClientEvents> {
	name: Events
	once: boolean
	execute(...e: ClientEvents[Event]): unknown
}

export interface ReadyEvent extends EventFile<'ready'> {
	earthquakeMonitor: (c: Client) => unknown
	changeProfilePicture: (c: Client) => unknown
	sendBasicData: (c: Client) => unknown
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
	guildOnly?: boolean
	guildSpecific?: boolean
	guildId?: Snowflake
	execute: (interaction: ChatInputCommandInteraction<"cached">) => Promise<unknown>
	autocomplete?: (interaction: AutocompleteInteraction) => Promise<unknown>
}

export interface MessageCommand {
	name: string,
	ownerOnly?: boolean,
	execute: (m: Message, args: Array<string>) => Promise<unknown>
}
export interface Song {
	/** El usuario que pidió esta canción */
	requestedBy: string
	/** id del video */
	id: string
	/** Nombre del video (Solo disponible cuando se usa el menú de selección) */
	name?: string
	/** Nombre del usuario que subió el video (Solo disponible cuando se usa el menú de selección) */
	uploader?: string
	/** Duración del video (Solo disponible cuando se usa el menú de selección) */
	duration?: string
	/** Dirección al video en el disco */
	path_to_video: string
}

interface SongQueue {
	/** The channel where the first interaction to play music was made */
	channelId: Snowflake
	songs: Song[]
}

declare module 'discord.js' {
	interface BaseClient {
		commands: Collection<string, SlashCommandTemplate>
		messageCommands: Collection<string, MessageCommand>
		util: {
			emoji: {
				sad: Emoji
				angry: Emoji
				question: Emoji
				thumbsup: Emoji
				tehe: Emoji
			}
		}
		get suggestion_channel(): GuildTextBasedChannel
		get selfroles_channel(): TextChannel
		get mainGuild(): Guild
		loadEmojis: () => boolean
	}
	interface BaseGuild {
		queue?: SongQueue,
		audioPlayer?: AudioPlayer
	}
}
