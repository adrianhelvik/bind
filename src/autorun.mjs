import {manager} from './state.mjs'

function autorun(fn) {
  const {accessed, updated} = manager.track(fn)

  if (updated.size)
    throw Error('Encountered mutation in an autorun function.')

  for (let atom of accessed)
    atom.onUpdate(fn)
}

export default autorun
