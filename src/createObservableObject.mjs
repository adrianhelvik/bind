import action from './action.mjs'
import Atom from './Atom.mjs'

function createObservableObject(source = {}) {
  const atoms = new Map()

  return new Proxy(source, {
    get(target, property, receiver) {
      if (! atoms.has(property))
        atoms.set(property, new Atom(property))
      atoms.get(property).accessed()
      return Reflect.get(target, property, receiver)
    },
    set(target, property, value, receiver) {
      if (! atoms.has(property))
        atoms.set(property, new Atom(property))
      let result
      action(() => {
        result = Reflect.set(target, property, value, receiver)
        atoms.get(property).updated()
      })
      return result
    }
  })
}

export default createObservableObject
