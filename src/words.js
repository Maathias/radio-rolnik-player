import chalk from 'chalk'
import yesno from 'yesno'

import { getTop, getTrack } from './modules/calls.js'
import { logAction, logTrack, logValue } from './modules/log.js'
import { single, filter, info } from './modules/lyrics.js'
import { convert } from './modules/youtube.js'

const lowWordCount = 190

async function one({ title, artists, tid }) {
	if (tid) {
		logAction('Resolving tid')
		var { title, artists } = await getTrack(tid)
	}

	logValue('Title', title)
	logValue('Artists', artists)

	logAction('Getting Track')
	const {
		id: gid,
		title: gTitle,
		url,
		lyrics,
		match,
	} = await info(title, artists)

	logValue('Genius ID', gid)
	logValue('Title', gTitle)
	logValue('Title match', match)
	logValue('Url', url)

	logAction('Running filter')

	const { results, wordCount, highlighted } = filter(lyrics)

	logValue('Word count', wordCount)

	for (let trigger in results) {
		let count = results[trigger]
		console.info(count > 1 ? chalk.red('x' + count) : '  ', trigger)
	}

	let display = await yesno({
		question: 'Display lyrics?',
		defaultValue: false,
	})

	console.log()

	if (display) console.info(highlighted)

	return 0
}

export { one }

export default function words({ sus, rolling }) {
	return getTop(rolling ? 'rolling' : 'once').then(async (top) => {
		for (let tid of top.slice(20)) {
			const { title, artists } = await getTrack(tid)

			info(title, artists).then(({ title: gTitle, lyrics, match }) => {
				const { results, wordCount, fLyrics } = filter(lyrics)
				let keys = results ? Object.keys(results) : 0

				let track = {
						tid,
						title: gTitle || title,
					},
					options = {
						color: 'green',
					}

				if (keys.length > 0) {
					// trigger words found
					options.color = 'red'
					options.meta = keys
						.map((trigger) => `${trigger} x${results[trigger]}`)
						.join(', ')
				} else if (match < 1) {
					// title mismatch
					options.color = 'magenta'
					options.meta = `title mismatch: ${title}`
				} else if (wordCount <= lowWordCount) {
					// low word count
					options.color = 'cyan'
					options.meta = `low word count: ${wordCount}`
				} else if (lyrics == null) {
					// no lyrics found
					options.color = 'yellow'
					options.meta = ' no lyrics found'
				} else {
					if (sus) return
				}

				logTrack(track, options)
			})
		}
	})
}
