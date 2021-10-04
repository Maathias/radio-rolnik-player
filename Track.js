class Track {
	constructor({ url, tid, info: [{ id, title, duration }] }) {
		this.url = url
		this.tid = tid
		this.ytid = id
		this.title = title
		this.duration = duration
	}
}

export default Track
