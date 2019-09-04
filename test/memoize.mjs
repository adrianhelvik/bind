import { memoize, batch, Binding } from '../src/index.mjs' 

describe('memoize', () => {
  it('calls the function the first time it is called', () => {
    let called = false
    memoize(() => {
      called = true
    })()
    expect(called).to.equal(true)
  })

  it('does not call the function the second time it is called', () => {
    let called = 0
    const fn = memoize(() => {
      called += 1
    })
    fn()
    fn()
    expect(called).to.equal(1)
  })

  it('calls the function a second time if an affected binding changed', () => {
    const binding = new Binding()
    let count = 0

    const fn = memoize(() => {
      binding.accessed()
      count += 1
    })

    fn()
    batch(() => {
      binding.updated()
    })
    fn()

    expect(count).to.equal(2)
  })

  it('does not call the wrapped function a second time before the outer function is called again', () => {
    const binding = new Binding()
    let count = 0

    const fn = memoize(() => {
      binding.accessed()
      count += 1
    })

    fn()
    batch(() => {
      binding.updated()
    })
    // fn() <-- Not calling this should prevent triggering the update

    expect(count).to.equal(1)
  })
})
