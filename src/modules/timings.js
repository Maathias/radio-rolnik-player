import Time from '../classes/Time.js'

import timings from '../../resources/przerwy.js'

const seconds = timings.map((przerwa) =>
	przerwa.map(([h, m]) => h * 60 * 60 + m * 60)
)

const durations = seconds.map(([start, end]) => end - start)

const times = timings.map((przerwa) => przerwa.map(([h, m]) => new Time(h, m)))

export { timings, seconds, durations, times }
