import Manager from '../src/Manager.mjs'
import Atom from '../src/Atom.mjs'

describe('Atom', () => {
  let manager
  let atom

  beforeEach(() => {
    manager = {
      accessed: [],
      updated: [],
      addUpdated(atom) {
        this.updated.push(atom)
      },
      addAccessed(atom) {
        this.accessed.push(atom)
      },
    }
    atom = new Atom(manager, 'test')
  })

  it('can notify the manager when updated', () => {
    atom.updated()
    expect(manager.updated.length).to.equal(1)
    expect(manager.updated[0]).to.equal(atom)
  })

  it('can notify the manager when accessed', () => {
    atom.accessed()
    expect(manager.accessed.length).to.equal(1)
    expect(manager.accessed[0]).to.equal(atom)
  })
})
