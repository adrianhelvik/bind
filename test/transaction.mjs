import transaction from '../src/transaction.mjs'
import observable from '../src/observable.mjs'
import { manager } from '../src/state.mjs'

describe('transaction', () => {
  it('tracks updates', () => {
    const state = observable({
      n: 0,
    })
    const {transaction} = manager.transaction(() => {
      state.n += 1
      state.n += 1
    })
    expect(transaction.length).to.equal(2)
  })

  it('can be reverted', () => {
    const state = observable({
      a: 0,
      b: 1,
      c: 2,
    })

    const {transaction} = manager.transaction(() => {
      for (const key of Object.keys(state)) {
        state[key] = state[key] + 1
      }
    })

    manager.revertTransaction(transaction)
  })

  it('is reverted on errors', () => {
    const state = observable({
      n: 0,
    })
    let intermittentValue = null

    try {
      transaction(() => {
        state.n += 1
        intermittentValue = state.n
        throw Error('Purposefully throwing an error')
      })
    } catch (e) {
      console.log('Expected error:', e)
    }

    expect(state.n).to.equal(0)
    expect(intermittentValue).to.equal(1)
  })

  it('can recover a previously undefined property', () => {
    const state = observable()

    const {transaction} = manager.transaction(() => {
      state.new = 'Hello world'
    })

    manager.revertTransaction(transaction)

    expect(state.hasOwnProperty('new')).to.equal(false)
  })


  describe('can revert changes on an observable array', () => {
    it('push()', () => {
      const state = observable([])

      state.push(1)
      state.push(2)
      state.push(3)

      const {transaction} = manager.transaction(() => {
        state.push(4)
        state.push(5)
        state.push(6)
        throw Error('Purposefully throwing an error')
      })

      expect(state).to.eql([1, 2, 3, 4, 5, 6])

      console.log(transaction)

      manager.revertTransaction(transaction)

      expect(state).to.eql([1, 2, 3])
    })
  })
})
