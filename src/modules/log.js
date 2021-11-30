import chalk from 'chalk'

function logValue(label, value) {
	console.info(label + ':', chalk.yellow(value))
}

function logAction(label, ...value) {
	console.info(chalk.bold(label), chalk.yellow(value.join(' ')))
}

function logError(label, value) {
	console.info(chalk.red(`§ ${label}`), value)
}

function logSchedule(time, label) {
	let { h, m, s } = time.hms()
	console.info(
		`${label ? '»»» ' + chalk.yellow(label) : ' Ø'} ${(time.to() > 0
			? chalk.green
			: chalk.cyan)(`${h}:${m}:${s}`)} (in ${time.to()}s)`,
		(label && '\n') || ''
	)
}

function logTrack(track, { color = 'blue', meta = '' } = {}) {
	console.info(` ╔ ${chalk[color](track.title.slice(0, 50))}`)

	if (meta) console.info(` ║ ${meta}`)

	console.info(
		` ╚ ${
			track.duration
				? `(${chalk.cyan((track.duration / 60e3).toFixed(1))})`
				: ''
		} ${chalk.gray(`${track.tid ?? ''} . ${track.ytid ?? ''}`)} `
	)
}

export { logValue, logAction, logError, logSchedule, logTrack }
