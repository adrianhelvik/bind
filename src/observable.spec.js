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
