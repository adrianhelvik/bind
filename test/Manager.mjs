import {manager} from '../src/state.mjs'
import Atom from '../src/Atom.mjs'

describe('Manager', () => {
  let atoms
  beforeEach(() => {
    atoms = [
      new Atom('atom 1'),
      new Atom('atom 2'),
      new Atom('atom 3'),
      new Atom('atom 4'),
      new Atom('atom 5'),
    ]
  })

  it('can track updates during a function', () => {
    const {updated} = manager.track(() => {
      atoms[0].updated()
      atoms[2].updated()
      atoms[4].updated()
    })

    expect(updated.size).to.equal(3)

    const updatedArray = Array.from(updated)
      .sort((a, b) => a.name.localeCompare(b.name))

    expect(updatedArray[0].name).to.equal(atoms[0].name)
    expect(updatedArray[1].name).to.equal(atoms[2].name)
    expect(updatedArray[2].name).to.equal(atoms[4].name)
  })

  it('can track accesses during a function', () => {
    const {accessed} = manager.track(() => {
      atoms[1].accessed()
      atoms[3].accessed()
    })

    expect(accessed.size).to.equal(2)

    const accessedArray = Array.from(accessed)
      .sort((a, b) => a.name.localeCompare(b.name))

    expect(accessedArray[0].name).to.equal(atoms[1].name)
    expect(accessedArray[1].name).to.equal(atoms[3].name)
  })
})
