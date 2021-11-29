import env from '../../env.js'

import chalk from 'chalk'
import got from 'got'
import spotifyToYt from 'spotify-to-yt'
import { logAction, logValue } from './log.js'

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

function getTop(mode = 'once') {
	logAction(`Fetching tids`, mode)

	return got
		.get(`https://${DOMAIN}/api/player/get/top?mode=${mode}`, {
			headers,
		})
		.json()
		.then((tids) => {
			logValue('Tracks', tids.length)
			return tids
		})
}

function getTrack(tid) {
	return got.get(`https://${DOMAIN}/api/track/${tid}`).json()
}

export { updateStatus, updateNext, getTop, getTrack }
