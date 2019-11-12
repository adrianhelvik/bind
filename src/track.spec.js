import observable from './observable.js'
import track from './track.js'

it('can track methods on prototypes', () => {
  class Todo {
    constructor(values) {
      this.done = false
      this.text = ''
      Object.assign(this, values)
    }

    toggle() {
      this.done = !this.done
    }
  }

  const state = observable({
    todos: [
      new Todo({
        text: 'make todo list',
        done: true,
      }),
    ],
  })

  const { updated } = track(() => {
    state.todos[0].toggle()
  })

  expect(updated.size).toBe(1)
})
