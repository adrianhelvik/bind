import { manager } from './state.js'

class Binding {
  constructor(name) {
    this.updateHandlers = new Set()
    this.name = name || 'untitled'
  }

  inspect() {
    return `Binding('${this.name.replace(/'/g, "\\'")}')`
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
      this.updateHandlers.delete(fn)
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
    if (error) throw error
  }
}

export default Binding
