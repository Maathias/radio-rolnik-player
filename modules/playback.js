import { spawn } from 'child_process'
import dotenv from 'dotenv'

dotenv.config()

const radio = spawn('python', ['modules/radio.py']),
	verbose = Number(process.env.VERBOSE)

var busy = true,
	waiting = []

radio.stdout.on('data', (data) => {
	let lines = data.toString().split('\n')
	for (let line of lines) {
		let [status, ...data] = JSON.parse(line)

		verbose > 0 && console.info(' -> ', status, data)

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
	throw data.toString()
})

radio.on('close', (code) => {
	throw `child process exited with code ${code}`
})

function sendCommand(comm, data = [null]) {
	verbose > 1 && console.info(' <- ', comm, data)
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

radio.stdin.setEncoding('utf-8')

const player = {
	play: () => queueCommand('play'),
	pause: () => queueCommand('pause'),
	stop: () => queueCommand('stop'),
	volume: (vol) => queueCommand('volume', [vol]),
	fadeOut: (duration = 3) => queueCommand('fade.out', [duration]),
	fadeIn: (duration = 3, target = 75) =>
		queueCommand('fade.in', [duration, target]),
}

export { player, queueCommand, sendCommand }
