import { manager } from './state.mjs'

export default function (fn) {
  const { error, result, transaction } =  manager.transaction(fn)

  if (error) {
    manager.revertTransaction(transaction)
    throw error
  }

  return result
}
