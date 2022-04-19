import { geniusKey } from '../../env.js'

import chalk from 'chalk'
import { getSong } from 'genius-lyrics-api'

import triggers from '../../resources/triggers.js'

/**
 * Filters
 * @param {String} lyrics Track lyrics to be filtered
 * @returns {Object.lyrics}
 */
function filter(lyrics) {
	// lyrics not found
	if (lyrics === null) {
		return { lyrics }
	}

	// split into words
	let words = lyrics.replace(/\n/g, '&n').split(/[\n\s]/),
		results = {},
		highlighted = []

	function check(word) {
		for (let trigger of triggers) {
			if (word.toLowerCase().match(trigger)) return trigger
		}
		return false
	}

	for (let word of words) {
		let trigger = check(word)
		if (trigger) {
			if (!results[trigger]) results[trigger] = 1
			else results[trigger]++

			highlighted.push(chalk.red(word))
		} else highlighted.push(word)
	}

	return {
		lyrics,
		results,
		wordCount: words.length,
		highlighted: highlighted.join(' ').replace(/&n/g, '\n'),
	}
}

async function info(title, artists) {
	var out = { id: null, url: null, title: null, lyrics: null },
		best = -1

	for (let artist of artists) {
		const result = await getSong({
				apiKey: geniusKey,
				optimizeQuery: true,
				title,
				artist: artist,
			}),
			target = title.split(' ')

		if (result) {
			let match = result.title.split(' ').filter((word) =>
				target.some((tword) => {
					return word.toLowerCase().includes(tword.toLowerCase())
				})
			).length

			result.match = match

			if (match > best) {
				best = match
				out = result
			}

			if (match == target.length) break
		}
	}

	return out
}

export { filter, info }
