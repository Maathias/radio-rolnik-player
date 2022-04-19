import { offset } from '../../env.js'

import { durations, seconds } from './timings.js'
import { download } from './youtube.js'
import { logAction } from './log.js'

import Time from '../classes/Time.js'

function parse(tracks) {
	let chart = durations.map(() => []),
		n = 0

	logAction(`Running parser`, tracks.length)

	for (let i in durations) {
		let total = 0
		while (total < durations[i]) {
			if (n >= tracks.length) break // end if tracks run out
			total += tracks[n].duration / 1e3 // add track duration to current total
			chart[i].push(tracks[n]) // add track to the chart
			n++
		}
	}

	return chart
}

function cache(chart) {
	const tracks = chart.flat()

	logAction(`Running caching`, `${tracks.length}`)

	return Promise.all(tracks.map((track) => download(track))).then(
		(paths) => chart
	)
}

function scheduler(chart) {
	let currentSeconds = Time.now() - offset,
		schedule = [],
		tracks = [],
		ends = []

	logAction(`Running scheduler`, `${seconds.length}`)

	for (let nthPrzerwa in seconds) {
		let [begin, end] = seconds[nthPrzerwa],
			times = [],
			subTracks = []

		var tracktotal = 0

		chart[nthPrzerwa].forEach((track, i) => {
			tracktotal += (chart[nthPrzerwa][i - 1]?.duration ?? 0) / 1e3

			let sched = new Time({ to: begin - currentSeconds + tracktotal })

			times.push(sched)
			subTracks.push(track)
		})

		let endin = new Time({ to: end - currentSeconds })

		schedule.push(times)
		tracks.push(subTracks)
		ends.push(endin)
	}

	return { schedule, tracks, ends }
}

export { parse, cache, scheduler }
