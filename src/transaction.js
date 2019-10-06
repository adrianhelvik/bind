import { manager } from './state.js'
import batch from './batch.js'

export default function transaction(fn) {
  let result

  batch(() => {
    const { error, transaction } = manager.transaction(fn)

    if (error) {
      manager.revertTransaction(transaction)
      throw error
    }

    result = transaction
  })

  return result
}
