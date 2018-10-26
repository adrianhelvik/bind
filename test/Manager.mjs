import Manager from '../src/Manager.mjs'
import Atom from '../src/Atom.mjs'

describe('Manager', () => {
  let manager
  let atoms
  beforeEach(() => {
    manager = new Manager()
    atoms = [
      new Atom(manager, 'atom 1'),
      new Atom(manager, 'atom 2'),
      new Atom(manager, 'atom 3'),
      new Atom(manager, 'atom 4'),
      new Atom(manager, 'atom 5'),
    ]
  })

  it('can track updates during a function', () => {
    const {updated} = manager.track(() => {
      atoms[0].updated()
      atoms[2].updated()
      atoms[4].updated()
    })

    expect(updated.length).to.equal(3)

    expect(updated[0].name).to.equal(atoms[0].name)
    expect(updated[1].name).to.equal(atoms[2].name)
    expect(updated[2].name).to.equal(atoms[4].name)
  })

  it('can track accesses during a function', () => {
    const {accessed} = manager.track(() => {
      atoms[1].accessed()
      atoms[3].accessed()
    })

    expect(accessed.length).to.equal(2)
    expect(accessed[0].name).to.equal(atoms[1].name)
    expect(accessed[1].name).to.equal(atoms[3].name)
  })
})
