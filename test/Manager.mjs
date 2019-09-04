import { Binding, track } from '../src/index.mjs'

describe('Manager', () => {
  let bindings
  beforeEach(() => {
    bindings = [
      new Binding('binding 1'),
      new Binding('binding 2'),
      new Binding('binding 3'),
      new Binding('binding 4'),
      new Binding('binding 5'),
    ]
  })

  it('can track updates during a function', () => {
    const {updated} = track(() => {
      bindings[0].updated()
      bindings[2].updated()
      bindings[4].updated()
    })

    expect(updated.size).to.equal(3)

    const updatedArray = Array.from(updated)
      .sort((a, b) => a.name.localeCompare(b.name))

    expect(updatedArray[0].name).to.equal(bindings[0].name)
    expect(updatedArray[1].name).to.equal(bindings[2].name)
    expect(updatedArray[2].name).to.equal(bindings[4].name)
  })

  it('can track accesses during a function', () => {
    const {accessed} = track(() => {
      bindings[1].accessed()
      bindings[3].accessed()
    })

    expect(accessed.size).to.equal(2)

    const accessedArray = Array.from(accessed)
      .sort((a, b) => a.name.localeCompare(b.name))

    expect(accessedArray[0].name).to.equal(bindings[1].name)
    expect(accessedArray[1].name).to.equal(bindings[3].name)
  })
})
