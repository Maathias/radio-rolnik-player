class Track {
	constructor(tid, { url, info: [{ id, title, duration }] }) {
		this.url = url
		this.tid = tid
		this.ytid = id
		this.title = title
		this.duration = duration + 2e3
	}
}

export default Track