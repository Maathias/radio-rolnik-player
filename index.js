import yargs from 'yargs'
import { getTop } from './src/modules/calls.js'
import { logTrack } from './src/modules/log.js'
import { convert } from './src/modules/youtube.js'

import standalone from './src/standalone.js'
import words, { one } from './src/words.js'

// Check Node version

const [minMajor, minMinor] = [16, 13],
	[major, minor] = process.version.slice(1).split('.')

if (major < minMajor || minor < minMinor) {
	console.error(
		`Node ${minMajor}.${minMinor} reqired. Running ${major}.${minor}`
	)
	process.exit(1)
}

// Parse arguments

const args = yargs(process.argv.slice(2))
	.option('tid', {
		alias: 'T',
	})
	.option('tids', {
		type: 'array',
		default: [],
	})
	.option('sus', {
		alias: 's',
		type: 'boolean',
	})
	.option('title', {
		alias: 't',
		type: 'array',
		default: [],
	})
	.option('artists', {
		alias: 'a',
		type: 'array',
		default: [],
	}).argv

// console.log(args)

switch (args._[0]) {
	default:
		console.log('Defaulting to Web module')
	case 'web':
		web()
		break
	case 'standalone':
		standalone()
		break
	case 'lyrics':
		if (args.T || args.t.length > 0 || args.a.length > 0) {
			let tid = args.T,
				title = args.t.join(' '),
				artists = args.a.join(' ')

			if (tid) {
				one({ tid })
			} else if (title && artists) {
				one({ title, artists })
			}
		} else words({ sus: args.s || args.banned })
		break
	case 'convert':
		let tid = args.T ? [args.T] : args.tids

		convert(tid).then((tracks) => {
			tracks.forEach((track) => {
				logTrack(track)
			})
		})
		break
}
