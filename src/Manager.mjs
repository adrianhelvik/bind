import Tracker from './Tracker.mjs'

class Manager {
  constructor() {
    this.trackers = []
  }

  track(fn) {
    const tracker = new Tracker(this)
    this.trackers.push(tracker) - 1
    tracker.track(fn)
    const index = this.trackers.indexOf(tracker)
    this.trackers.splice(index, 1)
    return tracker
  }

  addUpdated(atom) {
    for (const tracker of this.trackers)
      tracker.updated.push(atom)
  }

  addAccessed(atom) {
    for (const tracker of this.trackers)
      tracker.accessed.push(atom)
  }
}

export default Manager
