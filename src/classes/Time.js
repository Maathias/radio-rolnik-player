function pad(n) {
	return n < 10 ? '0' + n : n.toString()
}

class Time extends Date {
	constructor({ to, at, hms: { hours, minutes, seconds = 0 } = {} }) {
		super()

		if (to) {
			let at = Time.now() + to,
				hours = Math.floor(at / 3600),
				minutes = Math.floor((at - hours * 3600) / 60),
				seconds = (at - hours * 3600) % 60

			this.setHours(hours, minutes, seconds, 0)
		}
	}

	to() {
		return this.at() - Time.now()
	}

	at() {
		return this.getHours() * 3600 + this.getMinutes() * 60 + this.getSeconds()
	}

	hms() {
		return {
			h: this.getHours().toString(),
			m: pad(this.getMinutes()),
			s: pad(this.getSeconds()),
		}
	}

	static now() {
		let now = new Date()

		return now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()
	}
}

export default Time
