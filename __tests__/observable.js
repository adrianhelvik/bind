import { observable, reaction, batch, track } from '../src/index.js'

describe('observable', () => {
  it('can update a property', () => {
    const object = observable()
    let message

    reaction(() => {
      message = object.message
    })

    object.message = 'Hello world'

    expect(message).toBe('Hello world')
  })

  it('does not change when a different property is updated', () => {
    const object = observable()
    let count = 0

    batch(() => {
      object.notInUse
      count += 1
    })

    object.isInUse = true

    expect(count).toBe(1)
  })
})

describe('observable array', () => {
  let array
  beforeEach(() => {
    array = observable([1, 2, 3, 4, 5])
  })

  describe('mutators', () => {
    it('reacts to .push', () => {
      const { updated } = track(() => {
        array.push(1)
      })
      expect(updated.size).not.toBe(0)
    })

    it('reacts to .splice', () => {
      const { updated } = track(() => {
        array.splice(1, 1)
      })
      expect(updated.size).not.toBe(0)
    })

    it('reacts to .copyWithin', () => {
      const { updated } = track(() => {
        array.copyWithin(0, 2, 3)
      })
      expect(updated.size).not.toBe(0)
      expect(array).toEqual([3, 2, 3, 4, 5])
    })

    it('reacts to .fill', () => {
      const { updated } = track(() => {
        array.fill(123)
      })
      expect(updated.size).not.toBe(0)
      expect(array).toEqual([123, 123, 123, 123, 123])
    })

    it('reacts to .pop', () => {
      const { updated } = track(() => {
        array.pop()
      })
      expect(updated.size).not.toBe(0)
      expect(array).toEqual([1, 2, 3, 4])
    })

    it('reacts to .reverse', () => {
      const { updated } = track(() => {
        array.reverse()
      })
      expect(updated.size).not.toBe(0)
      expect(array).toEqual([5, 4, 3, 2, 1])
    })

    it('reacts to .shift', () => {
      const { updated } = track(() => {
        expect(array.shift()).toBe(1)
      })
      expect(updated.size).not.toBe(0)
      expect(array).toEqual([2, 3, 4, 5])
    })

    it('reacts to .sort', () => {
      const array = observable([5, 3, 2, 4, 1])
      const { updated } = track(() => {
        array.sort()
      })
      expect(updated.size).not.toBe(0)
      expect(array).toEqual([1, 2, 3, 4, 5])
    })

    it('reacts to .unshift', () => {
      const { updated } = track(() => {
        array.unshift(10)
      })
      expect(updated.size).not.toBe(0)
      expect(array).toEqual([10, 1, 2, 3, 4, 5])
    })

    it('reacts to .shift', () => {
      const { updated } = track(() => {
        expect(array.shift()).toBe(1)
      })
      expect(updated.size).not.toBe(0)
      expect(array).toEqual([2, 3, 4, 5])
    })

    it('reacts to index assignment', () => {
      const { updated } = track(() => {
        array[0] = 10
      })
      expect(updated.size).not.toBe(0)
    })
  })

  describe('accessors', () => {
    it('reacts to for..of', () => {
      const { accessed } = track(() => {
        for (let item of array);
      })
      expect(accessed.size).not.toBe(0)
    })

    it('reacts to index access', () => {
      const { accessed } = track(() => {
        array[0] // eslint-disable-line
      })
      expect(accessed.size).toBe(1)
    })

    it('reacts to method access', () => {
      const { accessed } = track(() => {
        array.pop // eslint-disable-line
      })
      expect(accessed.size).toBe(1)
    })

    it('reacts to non-existing access', () => {
      const { accessed } = track(() => {
        array.definitelyNotHere // eslint-disable-line
      })
      expect(accessed.size).toBe(1)
    })
  })
})
