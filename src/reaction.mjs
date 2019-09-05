import {manager} from './state.mjs'

function autorun(fn, whenTrue, whenFalse) {
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

    if (updated.size)
      throw Error('Encountered mutation in an autorun function.')

    for (let binding of accessed) {
      removers.push(binding.onUpdate(update))
    }

    if (returnValue && typeof whenTrue === 'function') {
      whenTrue(returnValue)
    }

    if (! returnValue && typeof whenFalse === 'function') {
      whenFalse(returnValue)
    }
  }

  return () => {
    removers.forEach(fn => fn())
  }
}

export default autorun
