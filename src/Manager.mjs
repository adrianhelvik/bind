import Tracker from './Tracker.mjs'

class Manager {
  constructor() {
    this.trackers = new Set()
    this.transactions = new Set()
    this.activeActions = 0
    this.debugging = 0
  }

  addUpdated(binding) {
    for (const tracker of this.trackers)
      tracker.updated.add(binding)
  }

  addAccessed(binding) {
    for (const tracker of this.trackers)
      tracker.accessed.add(binding)
  }

  track(fn) {
    const tracker = new Tracker(this)
    this.trackers.add(tracker)
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
    this.batch(() => {
      for (const action of transaction.slice().reverse()) {
        if (this.debugging) {
          console.log('Reverting action:', action)
        }
        const { isNew, target, property, previous } = action
        if (Array.isArray(target) && property === 'length') {
          while (target.length >= previous) {
            target.pop()
          }
        } else if (isNew) {
          delete target[property]
        } else {
          target[property] = previous
        }
        if (this.debugging) {
          console.log('Target after reverting:', target)
        }
      }
    })
  }

  batch(fn) {
    // When the first batch is executed,
    // create a set for the affected bindings.
    if (this.activeActions === 0)
      this.updatedBindings = new Set()

    // We want to know whether there are
    // actions executing at a given time,
    // so we'll simply track the number
    // of active actions.
    this.activeActions += 1

    try {
      // Find out which bindings are updated
      let result
      const {updated} = this.track(() => {
        result = fn()
      })
      for (const binding of updated)
        this.updatedBindings.add(binding)
      return result
    } finally {
      this.activeActions -= 1

      // And finally, when all actions are
      // completed, we want to run all
      // reactions for the affected bindings.
      if (this.activeActions === 0) {

        // Store the handlers in a set, so that
        // if multiple bindings stored the same
        // handlers, we only call those
        // functions once.
        const handlers = new Set()

        for (const binding of this.updatedBindings)
          for (const handler of binding.updateHandlers)
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
