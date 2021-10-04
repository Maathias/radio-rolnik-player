import dotenv from 'dotenv'
import got from 'got'

dotenv.config()

const { DOMAIN, SECRET } = process.env,
	headers = { authorization: 'Bearer ' + SECRET }

function updateStatus(tid, progress, duration, paused) {
	return new Promise((resolve, reject) => {
		got
			.put(`${DOMAIN}/player/set/status`, {
				headers,
				json: {
					tid,
					progress,
					duration,
					paused,
				},
			})
			.json()
			.then((ok) => resolve(ok))
			.catch((err) => reject(err))
	})
}

function updateNext(tid) {
	return new Promise((resolve, reject) => {
		got
			.put(`${DOMAIN}/player/set/next`, {
				headers,
				json: {
					tid,
				},
			})
			.json()
			.then((ok) => resolve(ok))
			.catch((err) => reject(err))
	})
}

function getTop() {
	return new Promise((resolve, reject) => {
		got
			.get(`${DOMAIN}/player/get/top`, {
				headers,
			})
			.json()
			.then((top) => {
				resolve(top)
			})
			.catch((err) => reject(err))
	})
}

export { updateStatus, updateNext, getTop }
