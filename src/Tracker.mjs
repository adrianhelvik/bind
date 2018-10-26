class Tracker {
  constructor(manager) {
    this.manager = manager
    this.accessed = []
    this.updated = []
  }

  track(fn) {
    this.tracking = true
    this.accessed = []
    this.updated = []
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
