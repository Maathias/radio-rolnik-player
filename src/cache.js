import { limit } from '../env.js'

import yesno from 'yesno'

import { getTop } from './modules/calls.js'
import { convert, download, check } from './modules/youtube.js'
import { parse } from './modules/parse.js'
import { logTrack } from './modules/log.js'
import Time from './classes/Time.js'

export default async function cache({ missingOnly }) {
	const tracks = await getTop() // tids
		.then((tids) => tids.slice(0, limit))
		.then(convert) // Tracks
		.then(parse) // chart
		.then((chart) => chart.flat()) // Tracks

	let missing = []

	for (let track of tracks) {
		const target = `./cache/${track.tid}.mp4`

		const { size, daysAgo } = check(target)

		if (size) {
			if (missingOnly) continue

			logTrack(track, {
				color: daysAgo >= 7 ? 'magenta' : 'green',
				meta: `${(size / 1000 / 1000).toFixed(1)}MB used ${daysAgo.toFixed(
					0
				)} days ago`,
			})
		} else {
			logTrack(track, { color: 'red', meta: 'Not cached' })
			missing.push(track)
		}
	}

	if (missing.length > 0)
		if (
			await yesno({
				question: `Download ${missing.length} missing tracks?`,
				defaultValue: false,
			})
		)
			for (let track of missing) {
				download(track)
			}
}
