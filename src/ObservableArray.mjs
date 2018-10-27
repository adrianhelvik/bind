import action from './action.mjs'
import Atom from './Atom.mjs'

const s_length = Symbol('length')

class ObservableArray extends Array {
  constructor(items) {
    super()
    this.atom = new Atom()
    if (Array.isArray(items)) {
      for (let i = 0; i < items.length; i++)
        this.push(items[i])
    }
    return trackIndexAccess(this)
  }

  // Additional APIs
  // ---------------

  toArray() {
    const result = []
    for (let i = 0; i < this.length; i++)
      result.push(this[i])
    return result
  }

  replace(replacement) {
    while (this.length)
      this.pop()
    for (let i = 0; i < replacement.length; i++)
      this.push(replacement[i])
    return this
  }

  // Mutators
  // --------
  // When a mutator is called, we
  // consider the array updated.
  // Even though it might no
  // always be the case.

  push(...args) {
    return action(() => {
      const result = super.push(...args)
      this.atom.updated()
      return result
    })
  }

  splice(...args) {
    return action(() => {
      const result = Array.prototype.splice(...args)
      this.atom.updated()
      return result
    })
  }

  copyWithin(...args) {
    return action(() => {
      const result = super.copyWithin(...args)
      this.atom.updated()
      return result
    })
  }

  fill(...args) {
    return action(() => {
      const result = super.fill(...args)
      this.atom.updated()
      return result
    })
  }

  pop(...args) {
    return action(() => {
      const result = super.pop(...args)
      this.atom.updated()
      return result
    })
  }

  reverse(...args) {
    return action(() => {
      const result = super.reverse(...args)
      this.atom.updated()
      return result
    })
  }

  shift(...args) {
    return action(() => {
      const result = super.shift(...args)
      this.atom.updated()
      return result
    })
  }

  sort(...args) {
    return action(() => {
      const result = super.sort(...args)
      this.atom.updated()
      return result
    })
  }

  unshift(...args) {
    return action(() => {
      const result = super.unshift(...args)
      this.atom.updated()
      return result
    })
  }

  shift(...args) {
    return action(() => {
      const result = super.shift(...args)
      this.atom.updated()
      return result
    })
  }
}

function trackIndexAccess(array) {
  return new Proxy(array, {
    set(target, property, value, receiver) {
      const result = Reflect.set(target, property, value, receiver)
      target.atom.updated()
      return result
    },
    get(target, property, receiver) {
      target.atom.accessed()
      return Reflect.get(target, property, receiver)
    }
  })
}

export default ObservableArray
