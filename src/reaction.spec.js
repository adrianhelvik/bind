import observable from './observable.js'
import reaction from './reaction.js'
import Binding from './Binding.js'
import batch from './batch.js'

it('can react to an updated binding', () => {
  const binding = new Binding()
  let updated = 0
  binding.onUpdate(() => {
    updated += 1
  })
  reaction(() => {
    binding.accessed()
  })
  binding.updated()
  expect(updated).toBe(1)
})

it('can react to updated bindings within a batch', () => {
  const binding = new Binding()
  let updated = 0
  binding.onUpdate(() => {
    updated += 1
  })
  reaction(() => {
    binding.accessed()
  })
  batch(() => {
    binding.updated()
    binding.updated()
  })
  expect(updated).toBe(1)
})

test('update bug', () => {
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

  const result = []
  let i = 0

  reaction(() => {
    result.push(`reaction ${++i}`)
    for (const todo of state.todos) {
      todo.done
    }
  })

  state.todos[0].done = false

  expect(result).toEqual(['reaction 1', 'reaction 2'])
})