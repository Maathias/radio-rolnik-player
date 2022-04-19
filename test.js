import { YouTube } from 'youtube-sr'

let track = {
	_id: {
		$oid: '615c77f0c3a15512f3215f5c',
	},
	album: {
		art: [
			{
				height: 640,
				url: 'https://i.scdn.co/image/ab67616d0000b2735755e164993798e0c9ef7d7a',
				width: 640,
			},
			{
				height: 300,
				url: 'https://i.scdn.co/image/ab67616d00001e025755e164993798e0c9ef7d7a',
				width: 300,
			},
			{
				height: 64,
				url: 'https://i.scdn.co/image/ab67616d000048515755e164993798e0c9ef7d7a',
				width: 64,
			},
		],
		name: 'Whenever You Need Somebody',
		year: 1987,
	},
	artists: ['Rick Astley'],
	id: '4cOdK2wGLETKBW3PvgPWqT',
	title: 'Never Gonna Give You Up',
	duration: 213573,
	explicit: false,
	banned: false,
	createdAt: {
		$date: '2021-10-05T16:06:08.537Z',
	},
	updatedAt: {
		$date: '2021-10-29T18:24:06.903Z',
	},
	__v: 0,
}

function max(arr) {
	return arr.reduce(
		(a, b, i) => (a[0] < b ? [b, i] : a),
		[Number.MIN_VALUE, -1]
	)
}

var results = await YouTube.search(
	`${track.title} ${track.artists.join(' ')} official audio`,
	{ limit: 10, type: 'video' }
)

console.log(results)

// let durations = results.map((video, i) => {
// 	if (video.duration < track.duration) {
// 		return video.duration / track.duration
// 	} else {
// 		return track.duration / video.duration
// 	}
// })

// console.log(durations)

// let keywords = results.map((video, i) => {
// 	// console.log(i, video.title)
// 	let total = 0
// 	const words = [['audio', 1]]

// 	for (let [word, weight] of words)
// 		if (video.title.toLowerCase().includes(word)) total += weight

// 	return total
// })

// console.log(keywords)

// var maxViews = max(results.map(({ views }) => views))[0]

// let views = results.map((video, i) => {
// 	// console.log(i, video.views, maxViews)
// 	return 1 - Math.abs(maxViews - video.views) / (maxViews / 2)
// })

// console.log(views)

// let sum = results.map((video, i) => durations[i] + keywords[i] + views[i])

// let [final, index] = max(sum)

// console.log(final, index, results[7])
