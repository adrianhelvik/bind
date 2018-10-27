class Tracker {
  constructor(manager) {
    this.manager = manager
    this.accessed = new Set()
    this.updated = new Set()
  }

  track(fn) {
    this.tracking = true
    this.accessed = new Set()
    this.updated = new Set()
    try {
      fn()
    } catch (e) {
      this.tracking = false
      throw e
    }
    return this
  }
}

export default Tracker
