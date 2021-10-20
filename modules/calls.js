import chalk from 'chalk'
import dotenv from 'dotenv'
import got from 'got'
import spotifyToYt from 'spotify-to-yt'

dotenv.config()

const { DOMAIN, SECRET } = process.env,
	headers = { authorization: 'Bearer ' + SECRET },
	verbose = Number(process.env.VERBOSE)

function updateStatus(tid, progress, duration, paused) {
	return new Promise((resolve, reject) => {
		verbose > 1 && console.info(`PUT status`, tid, progress, duration, paused)
		got
			.put(`https://${DOMAIN}/api/player/set/status`, {
				headers,
				json: {
					tid,
					progress,
					duration,
					paused,
				},
			})
			.json()
			.then((ok) => resolve(ok))
			.catch((err) => reject(err))
	})
}

function updateNext(tid) {
	return new Promise((resolve, reject) => {
		verbose > 1 && console.info(`PUT next`, tid)
		got
			.put(`https://${DOMAIN}/api/player/set/next`, {
				headers,
				json: {
					tid,
				},
			})
			.json()
			.then((ok) => resolve(ok))
			.catch((err) => reject(err))
	})
}

function getTop() {
	return new Promise((resolve, reject) => {
		verbose > 1 && console.info(`GET top`)
		got
			.get(`https://${DOMAIN}/api/player/get/top`, {
				headers,
			})
			.json()
			.then((top) => {
				console.info(`Resolving ${chalk.cyan(top.length)} tracks`)
				Promise.all(
					top.map((tid) => spotifyToYt.trackGet(`spotify:track:${tid}`))
				).then((yts) => {
					top.map((tid, i) => {
						yts[i].tid = tid
					})
					resolve(yts)
				})
			})
			.catch((err) => reject(err))
	})
}

export { updateStatus, updateNext, getTop }
