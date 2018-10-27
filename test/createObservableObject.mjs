import createObservableObject from '../src/createObservableObject.mjs'
import autorun from '../src/autorun.mjs'
import action from '../src/action.mjs'

describe('createObservableObject', () => {
  it('can update a property', () => {
    const object = createObservableObject()
    let message

    autorun(() => {
      message = object.message
    })

    object.message = 'Hello world'

    expect(message).to.equal('Hello world')
  })

  it('does not change when a different property is updated', () => {
    const object = createObservableObject()
    let count = 0

    autorun(() => {
      object.notInUse
      count += 1
    })

    object.isInUse = true

    expect(count).to.equal(1)
  })

  it('does not trigger change handlers more than once', () => {
    const object = createObservableObject()
    let count = 0

    autorun(() => {
      object.a
      object.b
      object.c
      count += 1
    })

    action(() => {
      object.a = 1
      object.b = 2
      object.c = 3
    })

    expect(count).to.equal(2)
  })
})
