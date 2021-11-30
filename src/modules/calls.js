import { domain, secret, verbose } from '../../env.js'

import got from 'got'

import { logAction, logValue } from './log.js'

const headers = { authorization: 'Bearer ' + secret }

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
	logAction(`Fetching tids`, mode, domain)

	return got
		.get(`https://${domain}/api/player/get/top?mode=${mode}`, {
			headers,
		})
		.json()
		.then((tids) => {
			logValue('Tracks', tids.length)
			return tids
		})
}

function getTrack(tid) {
	return got.get(`https://${domain}/api/track/${tid}`).json()
}

export { updateStatus, updateNext, getTop, getTrack }
