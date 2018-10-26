import ObservableArray from '../src/ObservableArray.mjs'
import Manager from '../src/Manager.mjs'

describe('ObservableArray', () => {
  let manager
  let array
  beforeEach(() => {
    manager = new Manager()
    array = new ObservableArray(manager, [])
  })

  describe('mutators', () => {
    it('reacts to .push', () => {
      const {updated} = manager.track(() => {
        array.push(1)
      })
      expect(updated.length).to.equal(1)
    })

    it('reacts to .splice', () => {
      const {updated} = manager.track(() => {
        array.splice(1, 1)
      })
      expect(updated.length).to.equal(1)
    })

    it('reacts to .copyWithin', () => {
      const {updated} = manager.track(() => {
        array.copyWithin()
      })
      expect(updated.length).to.equal(1)
    })

    it('reacts to .fill', () => {
      const {updated} = manager.track(() => {
        array.fill()
      })
      expect(updated.length).to.equal(1)
    })

    it('reacts to .pop', () => {
      const {updated} = manager.track(() => {
        array.pop()
      })
      expect(updated.length).to.equal(1)
    })

    it('reacts to .reverse', () => {
      const {updated} = manager.track(() => {
        array.reverse()
      })
      expect(updated.length).to.equal(1)
    })

    it('reacts to .shift', () => {
      const {updated} = manager.track(() => {
        array.shift()
      })
      expect(updated.length).to.equal(1)
    })

    it('reacts to .sort', () => {
      const {updated} = manager.track(() => {
        array.sort()
      })
      expect(updated.length).to.equal(1)
    })

    it('reacts to .unshift', () => {
      const {updated} = manager.track(() => {
        array.unshift()
      })
      expect(updated.length).to.equal(1)
    })

    it('reacts to .shift', () => {
      const {updated} = manager.track(() => {
        array.shift()
      })
      expect(updated.length).to.equal(1)
    })

    it('reacts to index assignment', () => {
      const {updated} = manager.track(() => {
        array[0] = 10
      })
      expect(updated.length).to.equal(1)
    })
  })
})
