import { manager } from './state.js'

export default fn => {
  manager.debugging += 1
  try {
    fn()
  } finally {
    manager.debugging -= 1
  }
}
