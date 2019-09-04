import {manager} from './state.mjs'

function batch(fn) {
  return manager.batch(fn)
}

export default batch
