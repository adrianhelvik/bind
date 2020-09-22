import { manager } from './state.js'

function reaction(fn, whenTrue, whenFalse) {
  let removers = []
  let accessed
  let updated

  update()

  function update() {
    removers.forEach(fn => fn())
    removers = []
    let returnValue
    ;({ accessed, updated } = manager.track(() => {
      returnValue = fn()
    }))

    for (let binding of accessed) {
      const removeListener = binding.onUpdate(update)
      removers.push(removeListener)
    }

    if (returnValue && typeof whenTrue === 'function') {
      whenTrue(returnValue)
    }

    if (!returnValue && typeof whenFalse === 'function') {
      whenFalse(returnValue)
    }
  }

  return () => {
    removers.forEach(fn => fn())
  }
}

export default reaction
