import { limit } from '../env.js'

import { getTop } from './modules/calls.js'
import { logSchedule, logTrack } from './modules/log.js'
import { parse, scheduler } from './modules/parse.js'
import { check, convert } from './modules/youtube.js'

export default async function schedule({
	checkCache = false,
	rolling = false,
}) {
	const { schedule, tracks, ends } = await getTop(rolling ? 'rolling' : 'once') // tids
		.then((tids) => tids.slice(0, limit))
		.then(convert) // Tracks
		.then(parse) // chart
		.then(scheduler) // schedule

	for (let przerwa in schedule) {
		let _tracks = tracks[przerwa],
			_times = schedule[przerwa],
			end = ends[przerwa]

		for (let n in _tracks) {
			let track = _tracks[n],
				starts = _times[n]

			if (checkCache) var { size } = check(`cache/${track.tid}.mp4`)

			logSchedule(starts)
			logTrack(track, {
				color: checkCache ? (size ? undefined : 'red') : undefined,
			})
		}

		logSchedule(end, `#${przerwa} End`)
	}
}
