import { SlashCommandTemplate } from "@myTypes/*"
import { ButtonStyle, ChatInputCommandInteraction, Colors, ComponentType, GuildMember, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, time, ChannelType, VoiceBasedChannel, VoiceChannel } from "discord.js"
import { setTimeout } from "node:timers/promises"

const VOTETIME = 60_000 // 1 minute
const activePolls = new Set<string>()

const Command: SlashCommandTemplate = {
	guildSpecific: true,
	guildId: "941735255721787432",
	guildOnly: true,
	data: new SlashCommandBuilder()
		.setDMPermission(false)
		.setName('cana')
		.setDescription('Manda a algun weta a la cana a través de una votación')
		.addUserOption(target =>
			target.setName('usuario')
				.setDescription('El usuario al que quieres mandar a la cana')
				.setRequired(true)
		)
		.addStringOption(reason =>
			reason.setName('razon')
				.setDescription('La razón por la que quieres enviar a este miembro a la cana (Opcional)')
				.setMaxLength(1000)
		)
	,
	async execute(interaction) {

		// Check if there is already an active poll
		if (activePolls.has(interaction.guildId))
			return void interaction.reply({ content: 'No puedes iniciar una votación mientras haya otra activa.', ephemeral: true })

		const targetUser = interaction.options.getUser('usuario', true)
		const targetMember = await interaction.guild.members.fetch(targetUser.id)

		if (!targetMember) {
			await interaction.reply({ content: 'Ocurrió un error con el comando. (Member Null)' })
			return null
		}
		// Permission check for Muki
		if (!interaction.guild.members.me?.permissions.has('MoveMembers'))
			return await interaction.reply({ content: 'Disculpa, pero no tengo permisos para mover miembros entre canales en este Servidor.', ephemeral: true })

		if (!interaction.member.voice.channel)
			return await interaction.reply({ content: 'Debes estar conectado a un canal de voz para usar este comando.', ephemeral: true })

		if (!targetMember.voice.channel)
			return await interaction.reply({ content: 'No puedes usar este comando sobre un miembro que no está conectado a un canal de voz.', ephemeral: true })

		if (targetMember.voice.channelId !== interaction.member.voice.channelId)
			return await interaction.reply({ content: 'No puedes usar este comando sobre un miembro conectado a un canal de voz distinto del tuyo.' })


		// Environment checks
		let jailChannel = interaction.guild.channels.cache.find(channel => channel.name === 'El Manzano' && channel.type === ChannelType.GuildVoice) as VoiceChannel | undefined
		if (!jailChannel) {

			if (!interaction.guild.members.me.permissions.has('ManageChannels')) {
				return void interaction.reply({ content: 'Este servidor no tiene un canal destinado como Cárcel. Por favor crea un canal de voz con el nombre `Carcel` para usar este comando, o dame permisos para administrar los canales de este servidor.', ephemeral: true })
			}

			jailChannel = await interaction.guild.channels.create({
				name: 'El Manzano',
				type: ChannelType.GuildVoice,
				permissionOverwrites: [
					{
						id: interaction.guildId,
						deny: ["Speak", "Connect"]
					}
				]
			})
		}


		return void CreatePoll(interaction, targetMember, jailChannel)

	},
}

async function CreatePoll(interaction: ChatInputCommandInteraction<'cached'>, targetMember: GuildMember, jailChannel: VoiceBasedChannel) {
	const voters = new Map<string, boolean>()

	const reason = interaction.options.getString('razon', false)

	const pollEmbed = new EmbedBuilder()
		.setTitle(`${interaction.member.displayName} quiere enviar a ${targetMember.displayName} a la cárcel`)
		.setColor(Colors.Blue)
		.setDescription(`**Duración**: 1 minuto\n${reason ? '**Motivo**: ' + reason : ""}`)
		.setImage(targetMember.user.displayAvatarURL({ size: 512 }))

	const actionRow = new ActionRowBuilder<ButtonBuilder>()
		.setComponents(
			new ButtonBuilder()
				.setCustomId('jail-yes')
				.setEmoji({ name: '✅' })
				.setStyle(ButtonStyle.Success)
				.setLabel('Aceptar'),
			new ButtonBuilder()
				.setCustomId('jail-no')
				.setEmoji({ name: '❌' })
				.setLabel('Salvar')
				.setStyle(ButtonStyle.Secondary)
		)

	const interactionResponse = await interaction.reply({
		content: `La votación termina \`en 1 minuto\``,
		embeds: [pollEmbed],
		components: [actionRow]
	})

	activePolls.add(interaction.guildId)

	interactionResponse.createMessageComponentCollector({
		componentType: ComponentType.Button,
		filter: (interaction) => {
			if (interaction.member.id === targetMember.id) {
				void interaction.reply({ content: 'No puedes votar en una votación donde tú eres el objetivo.', ephemeral: true })
				return false
			}

			if (voters.has(interaction.member.id)) {
				void interaction.reply({ content: 'No puedes votar nuevamente.', ephemeral: true })
				return false
			}

			voters.set(interaction.member.id, interaction.customId === 'jail-yes' ? true : false)
			void interaction.reply({ content: `Tu voto ha sido registrado con éxito ${interaction.client.util.emoji.thumbsup}`, ephemeral: true })
			return true

		},
		time: VOTETIME,
		max: interaction.member.voice.channel!.members.filter(member => member.user.bot === false).size - 1
	})
		.on('end', async (collected) => {
			activePolls.delete(interaction.guildId)
			const results: {
				yes: string[],
				no: string[]
			} = {
				yes: [],
				no: [],
			}

			for (const [id, vote] of voters) {
				if (vote) {
					results.yes.push(`<@${id}>`)
				} else {
					results.no.push(`<@${id}>`)
				}
			}

			pollEmbed.setFields(
				{
					name: 'Votos Si',
					value: results.yes.join('\n') || "0",
					inline: true
				},
				{
					name: 'Votos No',
					value: results.no.join('\n') || "0",
					inline: true,
				}
			)

			if (results.yes.length === results.no.length) {
				pollEmbed.setColor(Colors.DarkButNotBlack)

				return void interaction.editReply({
					content: `La votación ha terminado en un empate, ${targetMember} esta vez te has salvado.`,
					embeds: [pollEmbed],
					components: []
				})

			} else if (results.yes.length > results.no.length) {
				pollEmbed.setColor(Colors.Green)

				void interaction.editReply({
					content: `La votación a finalizado.\n${targetMember} vamo a la cana.\nSerás devuelto al canal en 1 minuto.`,
					embeds: [pollEmbed],
					components: []
				})

				// Move the member to the jail channel
				await setTimeout(5_000)

				const oldChannel = targetMember.voice.channel
				await targetMember.voice.setChannel(jailChannel, 'Cana')

				await setTimeout(60_000)
				await targetMember.voice.setChannel(oldChannel, 'Tiempo en cana terminado.')

			} else {
				pollEmbed.setColor(Colors.Blue)

				return void interaction.editReply({
					content: `La votación ha finalizado, ${targetMember} no irá a la cárcel.`,
					embeds: [pollEmbed],
					components: []
				})
			}

			/* TODO update the embed with the results. */

		})

}

export default Command