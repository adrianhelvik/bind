import createObservableObject from './createObservableObject.mjs'
import ObservableArray from './ObservableArray'
import memoize from './memoize.mjs'

const observable = {
  object: createObservableObject,
  array: (...args) => new ObservableArray(...args)
}

export {
  observable,
  autorun,
  memoize,
}
