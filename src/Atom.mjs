import {manager} from './state.mjs'

class Atom {
  constructor(name) {
    this.updateHandlers = new Set()
    this.name = name
  }

  updated() {
    manager.addUpdated(this)
  }

  accessed() {
    manager.addAccessed(this)
  }

  onUpdate(fn) {
    this.updateHandlers.add(fn)
    return () => {
      this.updateHandlers.remove(fn)
    }
  }

  callUpdateHandlers() {
    for (let handler of this.updateHandlers) {
      try {
        handler()
      } catch (e) {
        var error = error || e
      }
    }
    if (error)
      throw error
  }
}

export default Atom
