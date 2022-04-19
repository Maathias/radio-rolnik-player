import dotenv from 'dotenv'

const config = dotenv.config()

export default config

const defaultVolume = parseInt(process.env.VOLUME_DEFAULT ?? 100),
	offset = Number(process.env.OFFSET ?? 0),
	verbose = Number(process.env.VERBOSE ?? 0),
	limit = Number(process.env.LIMIT ?? 40),
	{ DOMAIN, SECRET, GENIUS_KEY } = process.env

export {
	defaultVolume,
	offset,
	verbose,
	limit,
	DOMAIN as domain,
	SECRET as secret,
	GENIUS_KEY as geniusKey,
}
