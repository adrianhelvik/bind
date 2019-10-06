import { manager } from './state.js'

function batch(fn) {
  return manager.batch(fn)
}

export default batch
