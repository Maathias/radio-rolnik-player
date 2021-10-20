import timings from '../przerwy.js'

const seconds = timings.map((przerwa) =>
	przerwa.map(([h, m]) => h * 60 * 60 + m * 60)
)

const durations = seconds.map(([start, end]) => end - start)

export { timings, seconds, durations }

function now() {
	let now = new Date()

	return now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()
}

export { now }
