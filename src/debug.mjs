import { manager } from './state.mjs'

export default fn => {
  manager.debugging += 1
  try {
    fn()
  } finally {
    manager.debugging -= 1
  }
}
