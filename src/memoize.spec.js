import { observable, memoize } from '.'

it('is run on first call', () => {
  let ran = false

  const fn = memoize(() => {
    ran = true
  })

  expect(ran).toBe(false)

  fn()

  expect(ran).toBe(true)
})

it('does not rerun when no state has changed', () => {
  let count = 0

  const fn = memoize(() => {
    count += 1
  })

  fn()
  fn()

  expect(count).toBe(1)
})

it('is rerun when it is called again and dependent state has changed', () => {
  const state = observable({})
  let count = 0

  const fn = memoize(() => {
    state.message
    count += 1
  })

  fn()

  state.message = 'Hello world'

  expect(count).toBe(1)
  fn()
  expect(count).toBe(2)
})

it('throws on recursive calls', () => {
  const fn = memoize(() => {
    fn()
  })

  expect(() => {
    fn()
  }).toThrow('Use memoize.skipRecursive to skip recursive calls')
})

it('can skip recursive calls', () => {
  let count = 0

  const fn = memoize.skipRecursive(() => {
    fn()
    count += 1
  })

  fn()

  expect(count).toBe(1)
})
