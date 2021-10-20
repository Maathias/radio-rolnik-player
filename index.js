import dotenv from 'dotenv'
import chalk from 'chalk'

import { player, queueCommand } from './modules/playback.js'
import { getTop, updateNext, updateStatus } from './modules/calls.js'
import { now, durations, seconds } from './modules/timings.js'

import Track from './Track.js'

dotenv.config()

const defaultVolume = parseInt(process.env.VOLUME_DEFAULT),
	offset = Number(process.env.OFFSET),
	verbose = Number(process.env.VERBOSE)

function play(track) {
	queueCommand('volume', [defaultVolume])
	queueCommand('change', [track.url])
	player.play()
	updateStatus(track.tid, 0, track.duration, false)
}

function sToHM(seconds) {
	let h = ~~(seconds / 3600),
		m = ~~((seconds - h * 3600) / 60)

	return [h, m]
}

console.info(
	`Volume: ${chalk.yellow(defaultVolume)}, Verbose: ${chalk.yellow(verbose)}`
)

console.info(`Fetching playlist (${chalk.yellow(process.env.DOMAIN)})`)

getTop()
	.then(async (data) => {
		console.info(`Parsing playlist`)

		let schedule = durations.map(() => [])

		const top = data.map((tdata) => new Track(tdata))

		let n = 0

		for (let i in durations) {
			let total = 0
			while (total < durations[i]) {
				if (n >= top.length) break
				total += top[n].duration / 1e3
				schedule[i].push(top[n])
				n++
			}
		}

		return schedule
	})
	.catch((err) => {
		throw err
	})
	.then((schedule) => {
		let currentSeconds = now() - offset

		console.info(
			`Running track scheduler @${new Date().toLocaleTimeString()} +${chalk.yellow(
				offset
			)}s`
		)

		for (let nthPrzerwa in seconds) {
			let [begin, end] = seconds[nthPrzerwa]

			var tracktotal = 0

			console.info(chalk.green(`\nPrzerwa #${nthPrzerwa}`))

			schedule[nthPrzerwa].forEach((track, i) => {
				tracktotal += (schedule[nthPrzerwa][i - 1]?.duration ?? 0) / 1e3

				let sched = begin - currentSeconds + tracktotal

				let [h, m] = sToHM(currentSeconds + sched)

				console.info(
					`scheduling ${track.tid} @ ${chalk.red(`${h}:${m}`)} in ${sched}s`
				)

				console.info(
					`  (${chalk.cyan((track.duration / 60e3).toFixed(1))}) [${chalk.blue(
						track.title.slice(0, 50)
					)}]`
				)

				if (sched < 0) return

				setTimeout(() => {
					console.info(
						`${chalk.magenta(`${h}:${m}`)} playing ${track.tid} (${track.ytid})`
					)

					console.info(
						`(${chalk.cyan((track.duration / 60e3).toFixed(1))}) ${chalk.blue(
							track.title.slice(0, 50)
						)} `
					)

					play(track)
					updateNext(schedule[nthPrzerwa][i + 1]?.tid ?? null)
				}, sched * 1e3)
			})

			verbose > 0 &&
				setTimeout(() => {
					console.info(`Beginning of #${nthPrzerwa} in 10s`)
				}, (begin - currentSeconds) * 1e3 - 10e3)

			let endin = end - currentSeconds,
				[h, m] = sToHM(end)

			console.info(`End of playback #${nthPrzerwa} @ ${h}:${m}`)

			setTimeout(() => {
				console.info(`Ending playback for #${nthPrzerwa}`)
				player.fadeOut(6)
				updateStatus(null, null, null, true)

				if (nthPrzerwa == seconds.length - 1) {
					console.info(`--- Day Ended ---`)
					setTimeout(() => {
						process.exit(0)
					}, 20e3)
				}
			}, endin * 1e3)
		}

		console.info(`\nTrack scheduling done`)
		console.info(`_______________________________`)
	})
