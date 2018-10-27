import createObservableObject from './createObservableObject.mjs'
import ObservableArray from './ObservableArray'
import memoize from './memoize.mjs'

const observable = Object.assign((value) => {
  if (Array.isArray(value))
    return observable.array(value)
  else
    return observable.object(value)
}, {
  object: createObservableObject,
  array: (...args) => new ObservableArray(...args)
})

export {
  observable,
  autorun,
  memoize,
}
