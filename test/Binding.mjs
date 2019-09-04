import { track, Binding } from '../src/index.mjs'

describe('Binding', () => {
  let binding

  beforeEach(() => {
    binding = new Binding('test')
  })

  it('can notify the when updated', () => {
    const {updated} = track(() => {
      binding.updated()
    })
    expect(updated.size).to.equal(1)
    expect(updated.has(binding)).to.equal(true)
  })

  it('can notify the when accessed', () => {
    const {accessed} = track(() => {
      binding.accessed()
    })
    expect(accessed.size).to.equal(1)
    expect(accessed.has(binding)).to.equal(true)
  })
})
