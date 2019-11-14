import observable from './observable.js'
import reaction from './reaction.js'
import track from './track.js'

it('wraps the real object', () => {
  const unwrapped = {}
  const wrapped = observable(unwrapped)
  unwrapped.message = 'Hello world'
  expect(wrapped.message).toBe('Hello world')
})

it('makes the object observable', () => {
  const state = observable({})

  const { updated } = track(() => {
    state.message = 'Hello world'
  })

  expect(updated.size).toBe(1)
})

it('makes children observable', () => {
  const state = observable({})

  state.container = {}

  const { updated } = track(() => {
    state.container.message = 'Hello world'
  })

  expect(updated.size).toBe(1)
})

it('does not make multiple observables for one object', () => {
  const real = {}
  const obs1 = observable(real)
  const obs2 = observable(real)

  expect(obs1).toBe(obs2)
})

it('does not wrap observables in observables', () => {
  const real = {}
  const obs1 = observable(real)
  const obs2 = observable(obs1)

  expect(obs1).toBe(obs2)
})
