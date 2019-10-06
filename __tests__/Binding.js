import { track, Binding } from '../src/index.js'

describe('Binding', () => {
  let binding

  beforeEach(() => {
    binding = new Binding('test')
  })

  it('can notify the when updated', () => {
    const { updated } = track(() => {
      binding.updated()
    })
    expect(updated.size).toBe(1)
    expect(updated.has(binding)).toBe(true)
  })

  it('can notify the when accessed', () => {
    const { accessed } = track(() => {
      binding.accessed()
    })
    expect(accessed.size).toBe(1)
    expect(accessed.has(binding)).toBe(true)
  })
})
