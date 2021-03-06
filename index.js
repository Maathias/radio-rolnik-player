import yargs from 'yargs'
import { readFileSync } from 'fs'

import web from './src/web.js'
import cache from './src/cache.js'
import schedule from './src/schedule.js'
import standalone from './src/standalone.js'
import test from './src/test.js'
import words, { one } from './src/words.js'

import { logAction, logTrack } from './src/modules/log.js'
import { convert } from './src/modules/youtube.js'

// Check Node version

const [minMajor, minMinor] = [16, 13],
	[major, minor] = process.version.slice(1).split('.')

if (major < minMajor || (major == minMajor && minor < minMinor)) {
	console.error(
		`Node ${minMajor}.${minMinor} reqired. Running ${major}.${minor}`
	)
	process.exit(1)
} else {
}

// Parse arguments

const args = yargs(process.argv.slice(2))
	.option('rolling', {
		alias: 'r',
		type: 'boolean',
	})
	.option('missing', {
		alias: 'm',
		type: 'boolean',
	})
	.option('cache', {
		alias: 'c',
		type: 'boolean',
		default: false,
	})
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
	.option('playlist', {
		alias: 'p',
		type: 'string',
	})
	.option('artists', {
		alias: 'a',
		type: 'array',
		default: [],
	}).argv

// console.log(args)

switch (args._[0]) {
	default:
		console.log('Defaulting to standalone')
	case 'standalone':
		standalone({ rolling: args.r })
		break
	case 'web':
		web()
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
		} else words({ susOnly: args.s || args.banned })
		break
	case 'convert':
		let tid = args.T ? [args.T] : args.tids

		convert(tid).then((tracks) => {
			tracks.forEach((track) => {
				logTrack(track)
			})
		})
		break
	case 'cache':
		cache({ missingOnly: args.m })
		break
	case 'schedule':
		schedule({ checkCache: args.c, rolling: args.r })
		break
	case 'test':
		test()
	case 'playlist':
		logAction('Reading playlist', args.p)
		const tids = JSON.parse(readFileSync(`./${args.p}.json`))
		standalone({ tids })
		break
}
