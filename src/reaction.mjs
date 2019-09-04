import {manager} from './state.mjs'

function autorun(fn) {
  let removers = []
  let accessed
  let updated

  update()

  function update() {
    removers.forEach(fn => fn())
    removers = []
    ;({ accessed, updated } = manager.track(fn))

    if (updated.size)
      throw Error('Encountered mutation in an autorun function.')

    for (let binding of accessed) {
      removers.push(binding.onUpdate(update))
    }
  }

  return () => {
    removers.forEach(fn => fn())
  }
}

export default autorun
