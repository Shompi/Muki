import { PermissionFlagsBits, SlashCommandBuilder } from "discord.js";
import { SlashCommand } from "@myTypes/index";
import { BanMember } from "./subcommandHandlers/mod-ban.js";
import { KickMember } from "./subcommandHandlers/mod-kick.js";
const OneDayInSeconds = 60 * 60 * 24

const DaysToDeleteMessages = {
	/** All values here are based on seconds */
	one: OneDayInSeconds,
	two: OneDayInSeconds * 2,
	three: OneDayInSeconds * 3,
	four: OneDayInSeconds * 4,
	five: OneDayInSeconds * 5,
	six: OneDayInSeconds * 6,
	seven: 604800
}

export default {
	data: new SlashCommandBuilder()
		.setName("mod")
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
		.setDescription("Comandos de moderación")
		.setDescriptionLocalization('en-US', "Moderation commands")
		/** Ban command */
		.addSubcommand(banCommand =>
			banCommand.setName("ban")
				.setDescription("Banea a un usuario de este servidor.")
				.setDescriptionLocalization("en-US", "Bans a member or an user from this guild")
				.addUserOption(user =>
					user.setName('user')
						.setDescription('La id del usuario o la mención del usuario que quieres banear')
						.setDescriptionLocalization("en-US", "Id or Mention of the user you want to ban")
						.setRequired(true)
				)
				.addIntegerOption(horas =>
					horas.setName('horas')
						.setNameLocalization("en-GB", "days")
						.setDescription('Los mensajes que fueron enviados por este usuario hace estos segundos atrás serán eliminados.')
						.setDescriptionLocalization("en-US", "The messages that were sent by this member on these seconds prior are going to be deleted")
						.addChoices(
							{
								name: "1 Dia",
								value: DaysToDeleteMessages.one,
								name_localizations: { "en-US": "1 Day" }
							},
							{
								name: "2 Dia",
								value: DaysToDeleteMessages.two,
								name_localizations: { "en-US": "2 Day" }
							},
							{
								name: "3 Dia",
								value: DaysToDeleteMessages.three,
								name_localizations: { "en-US": "3 Day" }
							},
							{
								name: "4 Dia",
								value: DaysToDeleteMessages.four,
								name_localizations: { "en-US": "4 Day" }
							},
							{
								name: "5 Dia",
								value: DaysToDeleteMessages.five,
								name_localizations: { "en-US": "5 Day" }
							},
							{
								name: "6 Dia",
								value: DaysToDeleteMessages.six,
								name_localizations: { "en-US": "6 Day" }
							},
							{
								name: "7 Dia",
								value: DaysToDeleteMessages.seven,
								name_localizations: { "en-US": "7 Day" }
							},
						)
				)
				.addStringOption(reason =>
					reason.setName('razon')
						.setNameLocalization('en-US', 'reason')
						.setDescription('La razón de este ban')
						.setDescriptionLocalization('en-US', "Reason for this ban")
				)
		).addSubcommand(kickCommand =>
			kickCommand.setName('kick')
				.setDescription('Expulsa a un miembro de este servidor')
				.setDescriptionLocalization("en-US", "Kicks a member from this guild")
				.addUserOption(userToKick =>
					userToKick.setName('user')
						.setDescription('El usuario al que quieres expulsar')
						.setDescriptionLocalization('en-US', "The user you want to kick")
						.setRequired(true)
				)
				.addStringOption(reason =>
					reason.setName('razon')
						.setDescription('La razón de esta expulsión')
				)
		),
	async execute(interaction) {

		const subcommand = interaction.options.getSubcommand()

		try {

			switch (subcommand) {
				case 'ban':
					return await BanMember(interaction)
				case 'kick':
					return await KickMember(interaction)
			}

		} catch (e) {

			console.log(e)

			return await interaction.reply({
				ephemeral: true,
				content: '❌ Ocurrió un error con esta interacción, el comando ha sido cancelado.'
			})
		}
	},
} as SlashCommand