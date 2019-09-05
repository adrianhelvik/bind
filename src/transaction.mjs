import { manager } from './state.mjs'
import batch from './batch.mjs'

export default function transaction(fn) {
  let result

  batch(() => {
    const { error, transaction } =  manager.transaction(fn)

    if (error) {
      manager.revertTransaction(transaction)
      throw error
    }

    result = transaction
  })

  return result
}
