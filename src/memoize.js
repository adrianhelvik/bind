import { manager } from './state.js'
import track from './track.js'

let staticSkipRecursive = false
const upToDate = 'upToDate'
const dirty = 'dirty'

const tracking = new WeakSet()

function memoize(fn) {
  const skipRecursive = staticSkipRecursive
  let status = dirty
  let removePrevious
  let value

  return () => {
    if (status === dirty) {
      const { accessed } = track(() => {
        if (tracking.has(fn)) {
          if (skipRecursive) {
            return
          }
          throw Error('Use memoize.skipRecursive to skip recursive calls')
        }
        tracking.add(fn)
        try {
          value = fn()
        } finally {
          tracking.delete(fn)
        }
      })
      const removers = new Set()
      for (const binding of accessed) {
        const remover = binding.onUpdate(() => {
          if (manager.debugging) {
            console.log('[debug]: Cache reset for memoized function')
          }
          status = dirty

          // We only need to know that
          // the value is dirty once,
          // so we can safely remove
          // further tracking until
          // the value is clean again.
          for (const remover of removers) remover()
        })
      }
      status = upToDate
    }
    if (skipRecursive) return
    return value
  }
}

memoize.skipRecursive = fn => {
  staticSkipRecursive = true
  try {
    return memoize(fn)
  } finally {
    staticSkipRecursive = false
  }
}

export default memoize
