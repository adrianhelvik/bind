import {manager, resetInternalState} from '../src/state.mjs'
import observable from '../src/observable.mjs'
import reaction from '../src/reaction.mjs'
import Manager from '../src/Manager.mjs'
import batch from '../src/batch.mjs'
import Atom from '../src/Atom.mjs'

describe('reaction', () => {
  beforeEach(() => {
    resetInternalState()
  })

  it('runs one time initially', () => {
    let count = 0
    reaction(() => {
      count += 1
    })
    expect(count).to.equal(1)
  })

  it('runs each time an atom is updated inside a batch', () => {
    const atom = new Atom(manager)
    let count = 0

    reaction(() => {
      atom.accessed()
      count += 1
    })

    manager.batch(() => {
      atom.updated()
    })

    expect(count).to.equal(2)
  })

  it('works with observable arrays', () => {
    const counter = {called: 0}
    const array = observable([])

    reaction(() => {
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

    reaction(() => {
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

  it('does not run before the batch is complete', () => {
    const object = observable()
    let count = 0

    reaction(() => {
      object.a
      object.b
      object.c
      count += 1
    })

    batch(() => {
      object.a = 1
      object.b = 2
      object.c = 3
    })

    expect(count).to.equal(2)
  })
})
