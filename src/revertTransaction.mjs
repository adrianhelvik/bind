import { manager } from './state.mjs'

export default function revertTransaction(transaction) {
  manager.revertTransaction(transaction)
}
