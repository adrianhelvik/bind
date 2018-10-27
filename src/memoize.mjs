import track from './track.mjs'

const upToDate = 'upToDate'
const dirty = 'dirty'

function memoize(fn) {
  let status = dirty
  let removePrevious
  let value

  return () => {
    if (status === dirty) {
      const {accessed} = track(() => {
        value = fn()
      })
      const removers = new Set()
      for (const atom of accessed) {
        const remover = atom.onUpdate(() => {
          status = dirty

          // We only need to know that
          // the value is dirty once,
          // so we can safely remove
          // further tracking until
          // the value is clean again.
          for (const remover of removers)
            remover()
        })
      }
      status = upToDate
    }
    return value
  }
}

export default memoize
