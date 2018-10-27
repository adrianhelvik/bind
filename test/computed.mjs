import computed from '../src/computed.mjs' 
import action from '../src/action.mjs'
import Atom from '../src/Atom.mjs'

describe('computed', () => {
  it('calls the function the first time it is called', () => {
    let called = false
    computed(() => {
      called = true
    })()
    expect(called).to.equal(true)
  })

  it('does not call the function the second time it is called', () => {
    let called = 0
    const fn = computed(() => {
      called += 1
    })
    fn()
    fn()
    expect(called).to.equal(1)
  })

  it('calls the function a second time if an affected atom changed', () => {
    const atom = new Atom()
    let count = 0

    const fn = computed(() => {
      atom.accessed()
      count += 1
    })

    fn()
    action(() => {
      atom.updated()
    })
    fn()

    expect(count).to.equal(2)
  })

  it('does not call the wrapped function a second time before the outer function is called again', () => {
    const atom = new Atom()
    let count = 0

    const fn = computed(() => {
      atom.accessed()
      count += 1
    })

    fn()
    action(() => {
      atom.updated()
    })
    // fn() <-- Not calling this should prevent triggering the update

    expect(count).to.equal(1)
  })
})
