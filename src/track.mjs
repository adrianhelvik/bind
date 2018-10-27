import {manager} from './state.mjs'

function track(fn) {
  return manager.track(fn)
}

export default track
