import { manager } from './state.js'

export default function revertTransaction(transaction) {
  manager.revertTransaction(transaction)
}
