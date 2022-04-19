import { getTop, updateNext, updateStatus } from './modules/calls.js'
import { logAction } from './modules/log.js'
import { cache } from './modules/parse.js'
import playback, { local, player, queueCommand } from './modules/playback.js'
import { convert } from './modules/youtube.js'

const delay = (n) => new Promise((r) => setTimeout(r, n))

export default async function test() {
	const tracks = await getTop() // tids
		.then((tids) => tids.slice(0, 3))
		.then(convert) // Tracks
		.then(cache)

	playback()

	for (let n in tracks) {
		logAction(`Playing track ${n + 1}/${tracks.length}`)
		local(tracks[n])
		player.play()
		updateNext(tracks[n + 1])
		await delay(10e3)
	}

	logAction(`Fading out`)
	player.fadeOut(6)
	updateStatus(null)

	await delay(7e3)
	queueCommand('exit')
}
