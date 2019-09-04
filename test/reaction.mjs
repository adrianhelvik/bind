import {
  observable,
  reaction,
  batch,
  Binding,
} from '../src/index.mjs'

describe('reaction', () => {
  it('runs one time initially', () => {
    let count = 0
    reaction(() => {
      count += 1
    })
    expect(count).to.equal(1)
  })

  it('runs each time an binding is updated inside a batch', () => {
    const binding = new Binding()
    let count = 0

    reaction(() => {
      binding.accessed()
      count += 1
    })

    batch(() => {
      binding.updated()
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
