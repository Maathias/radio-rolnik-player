import { domain, secret, verbose } from '../../env.js'

import got from 'got'

import { logAction, logValue } from './log.js'

const headers = { authorization: 'Bearer ' + secret }

function updateStatus(track, progress = null, duration = null, paused) {
	return new Promise((resolve, reject) => {
		console.log({
			tid: track?.tid ?? null,
			progress,
			duration,
			paused: paused ?? track ? false : true,
		})
		got
			.put(`https://${domain}/api/player/set/status`, {
				headers,
				json: {
					tid: track?.tid ?? null,
					progress,
					duration,
					paused: paused ?? track ? false : true,
				},
			})
			.json()
			.then((ok) => resolve(ok))
			.catch((err) => reject(err))

		verbose > 1 &&
			console.info(`PUT status`, track?.tid, progress, duration, paused)
	})
}

function updateNext(track) {
	return new Promise((resolve, reject) => {
		got
			.put(`https://${domain}/api/player/set/next`, {
				headers,
				json: {
					tid: track ? track.tid : null,
				},
			})
			.json()
			.then((ok) => resolve(ok))
			.catch((err) => reject(err))

		verbose > 1 && console.info(`PUT next`, track?.tid)
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
