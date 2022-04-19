import spotifyToYt from 'spotify-to-yt'
import { YouTube } from 'youtube-sr'
import {
	createWriteStream,
	existsSync,
	mkdirSync,
	renameSync,
	statSync,
} from 'fs'
import ytdl from 'ytdl-core'

import { logAction, logError } from './log.js'

import Track from '../classes/Track.js'
import { getTrack } from './calls.js'

const cache = './cache'

function convert(tids) {
	logAction(`Running converter`, tids.length)

	return Promise.all(
		tids.map(async (tid) => {
			let { title, artists } = await getTrack(tid)

			return await YouTube.search(
				`${title} ${artists.join(' ')} official audio`,
				{ limit: 10, type: 'video' }
			).then((videos) => {
				if (videos.length < 1) {
					logError('No videos found, retrying', tid)
					return YouTube.search(`${title} ${artists.join(' ')}`, {
						limit: 10,
						type: 'video',
					}).then((videos) => {
						if (videos.length < 1) {
							logError(`Conversion failed twice, I give up`, tid)
						} else return videos
					})
				} else return videos
			})
		})
	).then((ytd) => tids.map((tid, i) => new Track(tid, ytd[i])))

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

		if (!existsSync(cache)) {
			mkdirSync(cache)
		}

		let stream = ytdl(url, {
				filter: (format) => {
					if (format.hasVideo) return false
					if (format.container == 'mp4') return false
					return true
				},
			}),
			file = createWriteStream(temp)

		let written = 0

		stream.on('data', (data) => {
			file.write(data, () => {
				written += data.length
				progress(data.length, written)
			})
		})

		stream.on('end', () => {
			file.close(() => {
				renameSync(temp, final)
				end(final, written)
				resolve(final)
			})
		})
	})
}

function check(path) {
	if (existsSync(path)) {
		let { size, atime } = statSync(path),
			daysAgo = (new Date().getTime() - atime.getTime()) / 1024 / 60 / 60 / 24

		return { size, daysAgo }
	} else {
		return { size: null, daysAgo: null }
	}
}

async function download(track) {
	const target = `${cache}/${track.tid}.mp4`

	if (existsSync(target)) return target

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

export { convert, download, check }
