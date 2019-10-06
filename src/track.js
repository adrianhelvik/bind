import { manager } from './state.js'

function track(fn) {
  return manager.track(fn)
}

export default track
