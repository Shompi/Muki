import { request } from 'undici'
import keyv from 'keyv'
import { DatabasePaths } from '../../../globals/paths.js'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const client_id = process.env.IGDB_CLIENT_ID!
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const client_secret = process.env.IGDB_CLIENT_SECRET!

const tokens = new keyv(DatabasePaths.Twitch, { namespace: 'twitchtokens' })
const imagesLocalDB = new keyv(DatabasePaths.GameImages, { namespace: 'gameimages' })
const defaultCover = "https://puu.sh/F2ZUN/ea3856ca91.png"

const baseURL = "https://api.igdb.com/v4"

interface TokenObject {
	token: string
	expires: number
}

interface TokenExchangeResponse {
	access_token: string
	expires_in: number
	token_type: string
}

const getAccessToken = async () => {

	const token = (await tokens.get('token')) as TokenObject

	if (token) {
		// Chequear el tiempo de expiración

		// Si el tiempo de expiración del token que tenemos en la base de datos es mayor al tiempo actual
		// entonces nuestra token aún está activa
		if (token.expires >= Date.now()) return token.token
	}


	const url = `https://id.twitch.tv/oauth2/token?client_id=${client_id}&client_secret=${client_secret}&grant_type=client_credentials`

	const response = await request(url, { method: 'POST' }).then(response => response.body.json() as Promise<TokenExchangeResponse>).catch(() => null)

	if (!response) return

	const { access_token, expires_in } = response

	// Actualizamos la token en nuestra base de datos
	console.log("Se actualizó la token de IGDB")
	await tokens.set('token', { token: access_token, expires: (expires_in * 1000) + Date.now() })

	return access_token
}

export async function getGameCoverByName(gamename: string | null): Promise<string | null> {

	if (!gamename)
		return defaultCover
	// Primero chequemos que la imágen esté en la base de datos

	const savedImage = (await imagesLocalDB.get(gamename).catch(() => null)) as string

	if (savedImage) return savedImage

	const access_token = await getAccessToken()

	if (!access_token) {
		console.log('No se recibio un token de acceso a IGDB');
		return null
	}

	const response = await request(baseURL + "/covers", {
		headers: {
			'accept': 'application/json',
			'Client-ID': client_id,
			'authorization': `Bearer ${access_token}`
		},
		method: 'POST',
		body: `fields url; where game.name = "${gamename}";`
	}).then(response => response.body.json() as Promise<{ url: string, id: number }[]>)

	const cover = response[0]
	if (!cover) return defaultCover

	console.log(`Juego sin imagen: ${gamename}`)

	const formatedUrl = `https:${cover.url.replace("t_thumb", "t_720p")}`

	// Guardamos la imagen a nuestra base de datos para evitar futuras consultas a la API
	await imagesLocalDB.set(gamename, formatedUrl)

	return formatedUrl
}