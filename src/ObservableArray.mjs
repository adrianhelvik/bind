import Atom from './Atom.mjs'

const s_length = Symbol('length')

class ObservableArray extends Array {
  constructor(manager, items) {
    super(items)
    this.atom = new Atom(manager)
    this.manager = manager

    return trackIndexAccess(this)
  }

  splice(...args) {
    const result = super.splice(...args)
    this.atom.updated()
    return result
  }

  pop(...args) {
    const result = super.pop(...args)
    this.atom.updated()
    return result
  }

  reverse(...args) {
    const result = super.reverse(...args)
    this.atom.updated()
    return result
  }

  shift(...args) {
    const result = super.shift(...args)
    this.atom.updated()
    return result
  }

  sort(...args) {
    const result = super.sort(...args)
    this.atom.updated()
    return result
  }

  unshift(...args) {
    const result = super.unshift(...args)
    this.atom.updated()
    return result
  }
}

function trackIndexAccess(array) {
  return new Proxy(array, {
    set(target, property, value, receiver) {
      const result = Reflect.set(target, property, value, receiver)
      if (/^[0-9]+$/.test(property))
        target.atom.updated()
      if (property === 'length')
        target.atom
      return result
    }
  })
}

export default ObservableArray
