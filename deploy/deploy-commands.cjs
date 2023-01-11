require('dotenv').config();
const { readdirSync } = require('fs');
const { REST, Routes } = require('discord.js')
const { clientId } = require('./config.json');
const rest = new REST({ version: '10' }).setToken(process.env.BOT_TOKEN);


const globalCommands = [];
const commandFiles = readdirSync('js/interactionHandlers/slashcommands').filter(file => file.endsWith('.js') && (file.startsWith('cmd-') || file.startsWith('ctx-')));




async function registerCommands() {
	console.log("Registering commands...");

	for (const file of commandFiles) {

		const command = await import(`../js/interactionHandlers/slashcommands/${file}`);

		console.log('Command loaded:', command.data.name.toUpperCase());

		globalCommands.push(command.data.toJSON());
	}


	try {

		await rest.put(Routes.applicationCommands(clientId), { body: globalCommands });
		console.log(`Se registraron ${globalCommands.length} comandos globales`);

	} catch (e) { (console.error(e)) }
}

registerCommands();

// deploySpecific("941843371062861855");
