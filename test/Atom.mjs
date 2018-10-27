import track from '../src/track.mjs'
import Atom from '../src/Atom.mjs'

describe('Atom', () => {
  let atom

  beforeEach(() => {
    atom = new Atom('test')
  })

  it('can notify the when updated', () => {
    const {updated} = track(() => {
      atom.updated()
    })
    expect(updated.size).to.equal(1)
    expect(updated.has(atom)).to.equal(true)
  })

  it('can notify the when accessed', () => {
    const {accessed} = track(() => {
      atom.accessed()
    })
    expect(accessed.size).to.equal(1)
    expect(accessed.has(atom)).to.equal(true)
  })
})
