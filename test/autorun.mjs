import {manager, resetInternalState} from '../src/state.mjs'
import ObservableArray from '../src/ObservableArray.mjs'
import autorun from '../src/autorun.mjs'
import Manager from '../src/Manager.mjs'
import Atom from '../src/Atom.mjs'

describe('autorun', () => {
  beforeEach(() => {
    resetInternalState()
  })

  it('runs one time initially', () => {
    let count = 0
    autorun(() => {
      count += 1
    })
    expect(count).to.equal(1)
  })

  it('runs each time an atom is updated inside an action', () => {
    const atom = new Atom(manager)
    let count = 0

    autorun(() => {
      atom.accessed()
      count += 1
    })

    manager.action(() => {
      atom.updated()
    })

    expect(count).to.equal(2)
  })

  it('works with observable arrays', () => {
    const counter = {called: 0}
    const array = new ObservableArray([
      counter
    ])

    autorun(() => {
      array[0].called++
    })

    expect(counter.called).to.equal(1)

    array.push(10)

    expect(counter.called).to.equal(2)
  })
})
