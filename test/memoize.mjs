import memoize from '../src/memoize.mjs' 
import batch from '../src/batch.mjs'
import Atom from '../src/Atom.mjs'

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

  it('calls the function a second time if an affected atom changed', () => {
    const atom = new Atom()
    let count = 0

    const fn = memoize(() => {
      atom.accessed()
      count += 1
    })

    fn()
    batch(() => {
      atom.updated()
    })
    fn()

    expect(count).to.equal(2)
  })

  it('does not call the wrapped function a second time before the outer function is called again', () => {
    const atom = new Atom()
    let count = 0

    const fn = memoize(() => {
      atom.accessed()
      count += 1
    })

    fn()
    batch(() => {
      atom.updated()
    })
    // fn() <-- Not calling this should prevent triggering the update

    expect(count).to.equal(1)
  })
})
