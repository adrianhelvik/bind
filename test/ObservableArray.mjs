import ObservableArray from '../src/ObservableArray.mjs'
import track from '../src/track.mjs'

describe('ObservableArray', () => {
  let array
  beforeEach(() => {
    array = new ObservableArray([1, 2, 3, 4, 5])
  })

  describe('mutators', () => {
    it('reacts to .push', () => {
      const {updated} = track(() => {
        array.push(1)
      })
      expect(updated.size).to.equal(1)
    })

    it('reacts to .splice', () => {
      const {updated} = track(() => {
        array.splice(1, 1)
      })
      expect(updated.size).to.equal(1)
    })

    it('reacts to .copyWithin', () => {
      const {updated} = track(() => {
        array.copyWithin(0, 2, 3)
      })
      expect(updated.size).to.equal(1)
      expect(array).to.eql([3, 2, 3, 4, 5])
    })

    it('reacts to .fill', () => {
      const {updated} = track(() => {
        array.fill(123)
      })
      expect(updated.size).to.equal(1)
      expect(array).to.eql([123, 123, 123, 123, 123])
    })

    it('reacts to .pop', () => {
      const {updated} = track(() => {
        array.pop()
      })
      expect(updated.size).to.equal(1)
      expect(array).to.eql([1, 2, 3, 4])
    })

    it('reacts to .reverse', () => {
      const {updated} = track(() => {
        array.reverse()
      })
      expect(updated.size).to.equal(1)
      expect(array).to.eql([5, 4, 3, 2, 1])
    })

    it('reacts to .shift', () => {
      const {updated} = track(() => {
        expect(array.shift()).to.equal(1)
      })
      expect(updated.size).to.equal(1)
      expect(array).to.eql([2, 3, 4, 5])
    })

    it('reacts to .sort', () => {
      array.replace([5, 3, 2, 4, 1])
      const {updated} = track(() => {
        array.sort()
      })
      expect(updated.size).to.equal(1)
      expect(array).to.eql([1, 2, 3, 4, 5])
    })

    it('reacts to .unshift', () => {
      const {updated} = track(() => {
        array.unshift(10)
      })
      expect(updated.size).to.equal(1)
      expect(array).to.eql([10, 1, 2, 3, 4, 5])
    })

    it('reacts to .shift', () => {
      const {updated} = track(() => {
        expect(array.shift()).to.equal(1)
      })
      expect(updated.size).to.equal(1)
      expect(array).to.eql([2, 3, 4, 5])
    })

    it('reacts to index assignment', () => {
      const {updated} = track(() => {
        array[0] = 10
      })
      expect(updated.size).to.equal(1)
    })
  })

  describe('accessors', () => {
    it('reacts to for..of', () => {
      const {accessed} = track(() => {
        for (let item of array);
      })
      expect(accessed.size).to.equal(1)
    })

    it('reacts to index access', () => {
      const {accessed} = track(() => {
        array[0] // eslint-disable-line
      })
      expect(accessed.size).to.equal(1)
    })

    it('reacts to method access', () => {
      const {accessed} = track(() => {
        array.pop // eslint-disable-line
      })
      expect(accessed.size).to.equal(1)
    })

    it('reacts to non-existing access', () => {
      const {accessed} = track(() => {
        array.definitelyNotHere // eslint-disable-line
      })
      expect(accessed.size).to.equal(1)
    })
  })
})
