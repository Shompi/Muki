import * as dotenv from 'dotenv'
dotenv.config()

import { REST, Routes } from 'discord.js'
import { clientId } from './config.json'
const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);

async function registerCommands() {
	console.log("Registering commands...");

	const command = await import(`../js/interactionHandlers/slashcommands/cmd-jail.js`).then(module => module.default);


	try {

		await rest.put(Routes.applicationGuildCommands(clientId, command.guildId), { body: [command.data.toJSON()] });
		console.log(`Se registró el comando ${command.data.name} en la guild ${command.guildId}`);

	} catch (e) { (console.error(e)) }
}

registerCommands();
