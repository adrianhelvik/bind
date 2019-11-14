import { manager } from './state.js'
import Binding from './Binding.js'
import batch from './batch.js'

const IS_OBSERVABLE = Symbol('IS_OBSERVABLE')
export const GET_BINDING = Symbol('GET_BINDING')
const UNWRAP = Symbol('UNWRAP')
const observables = new WeakMap()

function observable(source = {}) {
  if (isObservable(source)) {
    return source
  }
  if (observables.has(source)) {
    return observables.get(source)
  }

  const bindings = new Map()
  const getBinding = key => bindings.get(key)

  const proxy = new Proxy(source, {
    get(target, property, receiver) {
      if (property === UNWRAP) {
        return source
      }

      if (property === IS_OBSERVABLE) {
        return true
      }

      if (property === GET_BINDING) {
        return getBinding
      }

      if (!bindings.has(property)) {
        bindings.set(property, new Binding(property))
      }

      bindings.get(property).accessed()

      const value = Reflect.get(target, property, receiver)

      if (value && typeof value === 'object') {
        return observable(value)
      }

      if (typeof value === 'function') {
        return function batchedMethod() {
          let result
          batch(() => {
            result = value.apply(this, arguments)
          })
          return result
        }
      }
      return value
    },
    set(target, property, value, receiver) {
      const isNew = !Object.prototype.hasOwnProperty.call(target, property)

      if (!bindings.has(property)) {
        bindings.set(property, new Binding(property))
      }

      let result
      let previous
      const binding = bindings.get(property)
      batch(() => {
        previous = target[property]
        result = Reflect.set(target, property, value, receiver)
        binding.updated()
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
    },
  })

  observables.set(source, proxy)

  return proxy
}

export default observable

export function isObservable(object) {
  return object && object[IS_OBSERVABLE]
}

export function unwrap(object) {
  if (!isObservable(object)) {
    return object
  }
  return object[UNWRAP]
}
