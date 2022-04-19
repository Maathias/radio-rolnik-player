class Track {
	constructor(tid, [{ id, title, duration }]) {
		this.url = `https://www.youtube.com/watch?v=${id}`
		this.tid = tid
		this.ytid = id
		this.title = title
		this.duration = duration + 2e3
	}
}

export default Track
