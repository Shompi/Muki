import { MessageCommand, MukiClient } from "@myTypes/*";

const command: MessageCommand = {
	name: 'reload',
	ownerOnly: true,
	async execute(m, args) {

		const client = m.client as MukiClient
		const commandName = args[0]
		if (!commandName) return void m.reply({ content: 'No especificaste el nombre de un comando.' })
		if (!client.messageCommands.has(args[0])) {
			return void m.reply({ content: 'No tengo un comando con ese nombre.' })
		}

		// Delete the command from the collection
		client.messageCommands.delete(commandName)

		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
		const commandFile = await import(`./${commandName}.js`).then((mod) => mod.default) as MessageCommand

		client.messageCommands.set(commandFile.name, commandFile)
		return
	},
}

export default command