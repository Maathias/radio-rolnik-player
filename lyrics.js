import chalk from 'chalk'

import { getTop, getTrack } from './modules/calls.js'
import { single, filter } from './modules/lyrics.js'

const lowWordCount = 190

getTop('rolling').then(async (top) => {
	for (let { tid } of top) {
		let { title, artists } = await getTrack(tid)

		single(title, artists[0])
			.then(filter)
			.then(({ lyrics, results, wordCount }) => {
				let keys = results ? Object.keys(results) : 0

				if (keys.length > 0) {
					// trigger words found
					console.log(
						`${chalk.red(`${tid} ${title} : ${artists}`)}: ${chalk.magenta(
							keys
								.map((trigger) => `${trigger} x${results[trigger]}`)
								.join(', ')
						)}`
					)
				} else if (lyrics == null) {
					// no lyrics found
					console.log(
						`${chalk.yellow(`${tid} ${title} : ${artists}`)}, no lyrics`
					)
				} else if (wordCount <= lowWordCount) {
					// low word count
					console.log(
						`${chalk.cyan(`${tid} ${title} : ${artists}`)}, ${wordCount} words`
					)
				} else {
					// all good
					console.log(chalk.green(`${tid} ${title} : ${artists}`))
				}
			})
	}
})
