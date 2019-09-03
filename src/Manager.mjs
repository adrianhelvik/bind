import Tracker from './Tracker.mjs'

class Manager {
  constructor() {
    this.trackers = new Set()
    this.transactions = new Set()
    this.activeActions = 0
  }

  addUpdated(atom) {
    for (const tracker of this.trackers)
      tracker.updated.add(atom)
  }

  addAccessed(atom) {
    for (const tracker of this.trackers)
      tracker.accessed.add(atom)
  }

  track(fn) {
    const tracker = new Tracker(this)
    this.trackers.add(tracker) - 1
    tracker.track(fn)
    this.trackers.delete(tracker)
    return tracker
  }

  transaction(fn) {
    const transaction = []
    this.transactions.add(transaction)
    try {
      var result = fn()
    } catch (error) {
      this.transactions.delete(transaction)
      return { result: null, transaction, error }
    }
    this.transactions.delete(transaction)
    return { result, transaction }
  }

  revertTransaction(transaction) {
    for (const { newProperty, target, property, previous } of transaction) {
      if (Array.isArray(target) && property === 'length') {
        while (target.length >= previous) {
          target.pop()
        }
      } else if (newProperty) {
        delete target[property]
      } else {
        target[property] = previous
      }
    }
  }

  action(fn) {
    // When the first action is executed,
    // create a set for the affected atoms.
    if (this.activeActions === 0)
      this.updatedAtoms = new Set()

    // We want to know whether there are
    // actions executing at a given time,
    // so we'll simply track the number
    // of active actions.
    this.activeActions += 1

    try {
      // Find out which atoms are updated
      let result
      const {updated} = this.track(() => {
        result = fn()
      })
      for (const atom of updated)
        this.updatedAtoms.add(atom)
      return result
    } finally {
      this.activeActions -= 1

      // And finally, when all actions are
      // completed, we want to run all
      // reactions for the affected atoms.
      if (this.activeActions === 0) {

        // Store the handlers in a set, so that
        // if multiple atoms stored the same
        // handlers, we only call those
        // functions once.
        const handlers = new Set()

        for (const atom of this.updatedAtoms)
          for (const handler of atom.updateHandlers)
            handlers.add(handler)

        for (const handler of handlers) {
          try {
            handler()
          } catch (e) {
            // Capture the first error that
            // is thrown, so that we can
            // rethrow it after we know that
            // all handlers have been executed
            var error = error || e
          }
        }
      }

      if (error)
        throw error
    }
  }
}

export default Manager
