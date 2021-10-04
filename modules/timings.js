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

function isPrzerwa() {
	let s = now()

	return seconds.some(([start, end]) => s > start && s < end)
}

function getPrzerwa() {
	let s = now()

	return seconds.findIndex(([start, end]) => s > start && s < end)
}

function howPrzerwa() {
	let s = now(),
		n = getPrzerwa(),
		[start, end] = seconds[n]

	console.log(s, n)

	return [s - start, end - s, end - start]
}

function untilPrzerwa() {
	if (!isPrzerwa()) {
		let s = now(),
			n = seconds.findIndex(([begin, end], i, me) => {
				let last = me[i - 1]

				return s < begin && s > (last ? last[1] : 0)
			})
		if (n === -1) return -1
		return seconds[n][0] - s
	} else return 0
}

export { now, isPrzerwa, getPrzerwa, howPrzerwa, untilPrzerwa }
