import { Client, EmbedBuilder, Colors, TextChannel } from "discord.js"
import { request } from "undici"

const APIURL = "https://api.gael.cloud/general/public/sismos"

interface EartquakeInfo {
	Fecha: string
	Profundidad: string
	Magnitud: string
	RefGeografica: string
	FechaUpdate: string
}

let oldEartquake: EartquakeInfo;

async function EarthquakeMonitor(client: Client) {
	console.log("Getting earthquakes...")
	const newEarthquake = await getEarthquakes().catch((error) => console.error(error))

	if (!newEarthquake) return undefined

	const channel = client.channels.cache.get("541007291718172683") as TextChannel

	return await channel.send({
		embeds: [newEarthquake]
	})
}

async function getEarthquakes() {

	const getColor = (mW: string) => {

		return parseFloat(mW) < 6 ? Colors.Yellow
			: parseFloat(mW) < 7 ? Colors.Orange
				: parseFloat(mW) < 8 ? Colors.DarkOrange
					: Colors.Red

	}

	const list: EartquakeInfo[] = await request(APIURL).then((r) => r.body.json())

	if (!list || list.length === 0) return;

	const lastEarthquake = list[0]

	if (lastEarthquake.Fecha === oldEartquake?.Fecha) return null

	oldEartquake = lastEarthquake;

	if (parseFloat(lastEarthquake.Magnitud) >= 5.5) {
		const embed = new EmbedBuilder()
			.setTitle(`Sismo de magnitud ${lastEarthquake.Magnitud} a ${lastEarthquake.RefGeografica}`)
			.setDescription(`**El sismo se registró a una profundidad de ${lastEarthquake.Profundidad}km**\n**Fecha:** \`${lastEarthquake.Fecha}\``)
			.setColor(getColor(lastEarthquake.Magnitud))

		return embed
	}

	return null
}

export { EarthquakeMonitor };