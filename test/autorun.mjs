import {manager, resetInternalState} from '../src/state.mjs'
import observable from '../src/observable.mjs'
import autorun from '../src/autorun.mjs'
import Manager from '../src/Manager.mjs'
import action from '../src/action.mjs'
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
    const array = observable([])

    autorun(() => {
      array.length
      counter.called++
    })

    expect(counter.called).to.equal(1)

    array.push(10)

    expect(counter.called).to.equal(2)
  })

  it('allows changes in the tracked variables', () => {
    const state = observable()

    let count = {
      a: 0,
      b: 0,
      c: 0,
    }

    autorun(() => {
      if (! state.a) return
      count.a += 1
      if (! state.b) return
      count.b += 1
      if (! state.c) return
      count.c += 1
    })

    state.a = true
    state.b = true
    state.c = true

    expect(count).to.eql({
      a: 3,
      b: 2,
      c: 1,
    })
  })

  it('does not run before the action is complete', () => {
    const object = observable()
    let count = 0

    autorun(() => {
      object.a
      object.b
      object.c
      count += 1
    })

    action(() => {
      object.a = 1
      object.b = 2
      object.c = 3
    })

    expect(count).to.equal(2)
  })
})
