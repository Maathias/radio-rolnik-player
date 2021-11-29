import spotifyToYt from 'spotify-to-yt'
import fs from 'fs'
import ytdl from 'ytdl-core'

import Track from '../classes/Track.js'
import { logAction, logError } from './log.js'

const cache = './cache'

function convert(tids) {
	logAction(`Running converter`, tids.length)

	return Promise.all(
		tids.map((tid) =>
			spotifyToYt.trackGet(`spotify:track:${tid}`).catch((err) => {
				logError(`Conversion failed, retrying`, tid)

				return spotifyToYt.trackGet(`spotify:track:${tid}`).catch((err2) => {
					logError(`Conversion failed twice, I give up`, tid)
					throw err2
				})
			})
		)
	).then((ytd) => {
		return tids.map((tid, i) => new Track(tid, ytd[i]))
	})
}

function fetch(url, target, progress, end) {
	return new Promise((resolve, reject) => {
		const temp = target + '.tmp',
			final = target

		if (!fs.existsSync(cache)) {
			fs.mkdirSync(cache)
		}

		let stream = ytdl(url, {
				filter: 'audioonly',
			}),
			file = fs.createWriteStream(temp)

		let written = 0

		stream.on('data', (data) => {
			file.write(data, () => {
				written += data.length
				progress(data.length, written)
			})
		})

		stream.on('end', () => {
			file.close()
			file.on('close', () => {
				fs.renameSync(temp, final)
				end(final, written)
				resolve(final)
			})
		})
	})
}

async function download(track) {
	const target = `${cache}/${track.tid}.mp4`

	if (fs.existsSync(target)) return target

	return await fetch(
		track.url,
		target,
		(chunk, total) => {
			process.stdout.clearLine()
			process.stdout.cursorTo(0)
			process.stdout.write(`${track.tid} ${(total / 1024).toFixed(0)}KB`)
		},
		() => {
			console.log()
		}
	).then((final) => {
		console.info(`downloaded`, final)
		return final
	})
}

export { convert, download }
