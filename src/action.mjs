import {manager} from './state.mjs'

function action(fn) {
  return manager.action(fn)
}

export default action
