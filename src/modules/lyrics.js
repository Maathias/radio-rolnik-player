import env from '../../env.js'

import { getLyrics, getSong } from 'genius-lyrics-api'

import triggers from '../../resources/triggers.js'
import chalk from 'chalk'

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

	// for (let trigger of triggers) {
	// 	let count = 0

	// 	for (let word of words) {
	// 		if (word.toLowerCase().match(trigger)) {
	// 			count++
	// 			console.log(word)
	// 			highlighted.push(chalk.red(word))
	// 			continue // only count first match
	// 		} else highlighted.push(word)
	// 	}

	// 	if (count > 0) results[trigger] = count
	// }

	return {
		lyrics,
		results,
		wordCount: words.length,
		highlighted: highlighted.join(' ').replace(/&n/g, '\n'),
	}
}

function single(title = '', artist = '') {
	return getLyrics({
		apiKey,
		optimizeQuery: true,
		title,
		artist,
	})
}

async function info(title, artists) {
	var out = { id: null, url: null, title: null, lyrics: null },
		best = -1

	for (let artist of artists) {
		const result = await getSong({
				apiKey,
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

			// console.log(result.title.split(' '), target)

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

export { single, filter, info }
