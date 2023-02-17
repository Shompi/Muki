import { MessageCommand } from "@myTypes/*";
import { exec } from "node:child_process"
import { promisify } from "node:util"
const Exec = promisify(exec)

const command: MessageCommand = {
	name: 'reload',
	ownerOnly: true,
	async execute(m, args) {

		const client = m.client
		const commandName = args[0]
		if (!commandName) return void m.reply({ content: 'No especificaste el nombre de un comando.' })
		if (!client.messageCommands.has(args[0])) {
			return void m.reply({ content: 'No tengo un comando con ese nombre.' })
		}

		// Delete the command from the collection
		client.messageCommands.delete(commandName)

		// compile the new command
		const { stderr, stdout } = await Exec('tsc')
		console.log(stderr, stdout);

		// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
		const commandFile = await import(`./${commandName}.js`).then((mod) => mod.default) as MessageCommand

		client.messageCommands.set(commandFile.name, commandFile)

		return void m.reply({ content: `El comando ${commandName} ha sido reiniciado.` })
	},
}

export default command