import env from '../env.js'
import { getLyrics } from 'genius-lyrics-api'

import triggers from '../resources/words.js'

const apiKey = process.env.GENIUS_KEY

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
	let words = lyrics.split(/[\n\s]/),
		results = {}

	for (let trigger of triggers) {
		let count = 0

		for (let word of words) {
			if (word.toLowerCase().match(trigger)) {
				count++
				continue // only count first match
			}
		}

		if (count > 0) results[trigger] = count
	}

	return { lyrics, results, wordCount: words.length }
}

function single(title = '', artist = '') {
	return getLyrics({
		apiKey,
		optimizeQuery: true,
		title,
		artist,
	})
}

export { single, filter }
