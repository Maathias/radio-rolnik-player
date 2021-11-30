import { defaultVolume, verbose } from '../../env.js'

import { spawn } from 'child_process'
import { updateStatus } from './calls.js'

class PlaybackError extends Error {
	constructor(message = '', ...args) {
		super(message, ...args)
	}
}

var radio,
	busy = true,
	waiting = []

export default async function playback() {
	radio = spawn('python', ['src/modules/radio.py'])

	radio.stdin.setEncoding('utf-8')

	radio.stdout.on('data', (data) => {
		let lines = data.toString().split('\n')
		for (let line of lines) {
			try {
				var [status, ...data] = JSON.parse(line)
			} catch (err) {
				console.error('Invalid JSON from player')
				console.error('Received: ', line)
				throw err
			}

			verbose > 1 && console.info('¤ >', status, data)

			if (status == 'waiting')
				if (data[0]) {
					busy = false
					if (waiting.length > 0) {
						waiting.shift().resolve()
					}
				}
		}
	})

	radio.stderr.on('data', (data) => {
		throw new PlaybackError(data.toString())
	})

	radio.on('close', (code) => {
		throw `vlc exited with code ${code}`
	})
}

function sendCommand(comm, data = [null]) {
	verbose > 1 && console.info('¤ <', comm, data)
	busy = true
	radio.stdin.write(JSON.stringify(['command', comm, ...data]) + '\n')
}

function queueCommand(comm, data) {
	if (busy) {
		new Promise((resolve, reject) => {
			waiting.push({ resolve, reject })
		}).then(() => {
			sendCommand(comm, data)
		})
	} else sendCommand(comm, data)
}

function stream(track) {
	queueCommand('change', [track.url])
	player.play()
	queueCommand('volume', [defaultVolume])
}

function local(track) {
	queueCommand('local', [`./cache/${track.tid}.mp4`])
	player.play()
	queueCommand('volume', [defaultVolume])
	updateStatus(track, 0, track.duration)
}

export { stream, local }

const player = {
	play: () => queueCommand('play'),
	pause: () => queueCommand('pause'),
	stop: () => queueCommand('stop'),
	volume: (vol) => queueCommand('volume', [vol]),
	fadeOut: (duration = 3) => queueCommand('fade.out', [duration]),
	fadeIn: (duration = 3, target = 75) =>
		queueCommand('fade.in', [duration, target]),
}

export { player, queueCommand }
