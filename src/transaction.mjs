import { manager } from './state.mjs'

export default function transaction(fn) {
  const { error, transaction } =  manager.transaction(fn)

  if (error) {
    manager.revertTransaction(transaction)
    throw error
  }

  return transaction
}
