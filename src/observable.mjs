import { manager } from './state.mjs'
import batch from './batch.mjs'
import Atom from './Atom.mjs'

export const GET_ATOM = Symbol('GET_ATOM')

function observable(source = {}) {
  const atoms = new Map()
  const getAtom = key => atoms.get(key)

  const proxy = new Proxy(source, {
    get(target, property, receiver) {
      if (property === GET_ATOM) {
        return getAtom
      }
      if (! atoms.has(property))
        atoms.set(property, new Atom(property))
      atoms.get(property).accessed()
      const value = Reflect.get(target, property, receiver)
      if (value && typeof value === 'object')
        return observable(value)
      if (typeof value === 'function')
        return function batchedMethod() {
          let result
          batch(() => {
            result = value.apply(this, arguments)
          })
          return result
        }
      return value
    },
    set(target, property, value, receiver) {
      const isNew = ! Object.prototype.hasOwnProperty.call(target, property)
      if (! atoms.has(property))
        atoms.set(property, new Atom(property))
      let result
      let previous
      const atom = atoms.get(property)
      batch(() => {
        previous = target[property]
        result = Reflect.set(target, property, value, receiver)
        atom.updated()
        for (const transaction of manager.transactions) {
          transaction.push({
            target: proxy,
            property,
            previous,
            current: value,
            isNew,
          })
        }
      })
      return result
    }
  })

  return proxy
}

export default observable
