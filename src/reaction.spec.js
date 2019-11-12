import observable from './observable.js'
import reaction from './reaction.js'
import Binding from './Binding.js'
import batch from './batch.js'

it('can react to an updated binding', () => {
  const binding = new Binding()
  let updated = 0
  binding.onUpdate(() => {
    updated += 1
  })
  reaction(() => {
    binding.accessed()
  })
  binding.updated()
  expect(updated).toBe(1)
})

it('can react to updated bindings within a batch', () => {
  const binding = new Binding()
  let updated = 0
  binding.onUpdate(() => {
    updated += 1
  })
  reaction(() => {
    binding.accessed()
  })
  batch(() => {
    binding.updated()
    binding.updated()
  })
  expect(updated).toBe(1)
})
