import env from '../env.js'
import chalk from 'chalk'

import playback, { player, queueCommand } from './modules/playback.js'
import { getTop, updateNext, updateStatus } from './modules/calls.js'
import { durations, seconds } from './modules/timings.js'
import { convert, download } from './modules/youtube.js'

import { logAction, logSchedule, logTrack, logValue } from './modules/log.js'
import Time from './classes/Time.js'

const defaultVolume = parseInt(process.env.VOLUME_DEFAULT ?? 100),
	offset = Number(process.env.OFFSET ?? 0),
	verbose = Number(process.env.VERBOSE ?? 0),
	limit = Number(process.env.LIMIT ?? 40)

function stream(track) {
	queueCommand('change', [track.url])
	player.play()
	queueCommand('volume', [defaultVolume])
	updateStatus(track.tid, 0, track.duration, false)
}

function local(track) {
	queueCommand('local', [`./cache/${track.tid}.mp4`])
	player.play()
	queueCommand('volume', [defaultVolume])
}

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

export default async function standalone() {
	logValue('Volume', defaultVolume)
	logValue('Offset', offset)
	logValue('Verbose', verbose)
	logValue('Limit', process.env.LIMIT)

	const { schedule, tracks, ends } = await getTop() // tids
		.then((tids) => tids.slice(0, limit))
		.then(convert) // Tracks
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
				}, starts.to() * 1e3)
		}

		// schedule END
		logSchedule(end, `#${przerwa} End`)

		if (end.to() >= 0)
			setTimeout(() => {
				logAction(`» End of #${przerwa} «`)
				player.fadeOut(6)
			}, end.to() * 1e3)
	}

	setTimeout(() => {
		logAction('≡≡≡ End of the day ≡≡≡')
		process.exit(0)
	}, (ends.at(-1).to() + 10) * 1e3)

	logAction('Starting player')
	playback()
}
