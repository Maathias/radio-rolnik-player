import { defaultVolume, offset, verbose, limit } from '../env.js'

import playback, { player, queueCommand } from './modules/playback.js'
import { getTop, updateNext, updateStatus } from './modules/calls.js'
import { convert } from './modules/youtube.js'
import { parse, cache, scheduler } from './modules/parse.js'
import { logAction, logSchedule, logTrack, logValue } from './modules/log.js'
import { local } from './modules/playback.js'

export default async function standalone({ tids, rolling } = {}) {
	logValue('Volume', defaultVolume)
	logValue('Offset', offset)
	logValue('Verbose', verbose)
	logValue('Limit', process.env.LIMIT)
	console.log(rolling)
	const _tids = (tids ?? (await getTop(rolling ? 'rolling' : 'once'))).slice(
		0,
		limit
	) // tids

	const { schedule, tracks, ends } = await convert(_tids) // Tracks
		.then(parse) // chart
		.then(cache)
		.then(scheduler) // schedule

	for (let przerwa in schedule) {
		let _tracks = tracks[przerwa],
			_times = schedule[przerwa],
			end = ends[przerwa]

		for (let n in _tracks) {
			let track = _tracks[n],
				starts = _times[n]

			// schedule TRACK
			logSchedule(starts)
			logTrack(track)

			if (starts.to() > -10)
				setTimeout(() => {
					logAction(` ╔ « Playing »`)
					logTrack(track)
					local(track)
					updateNext(_tracks[n + 1]?.tid ?? null)
				}, starts.to() * 1e3)
		}

		// schedule END
		logSchedule(end, `#${przerwa} End`)

		if (end.to() >= 0)
			setTimeout(() => {
				logAction(`» End of #${przerwa} «`)
				player.fadeOut(6)
				updateStatus(null, null, null, true)
			}, end.to() * 1e3)
	}

	setTimeout(() => {
		logAction('≡≡≡ End of the day ≡≡≡')
		process.exit(0)
	}, (ends.at(-1).to() + 10) * 1e3)

	logAction('Starting player')
	playback()
}
