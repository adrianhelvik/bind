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

it('does not error when updating unrelated state in a reaction', () => {
  const state = observable({
    a: true,
  })

  reaction(() => {
    if (state.a) state.b = true
  })

  expect(state.b).toBe(true)
})

xit('throws if a dependency is updated in a reaction', () => {
  const state = observable({
    count: 0,
  })

  expect(() => {
    reaction(() => {
      state.count += 1
      console.log(`The count is: ${state.count}`)
    })
  }).not.toThrow()
})

it('does not throw if a reaction triggers a reaction', () => {
  const state = observable({
    message: '',
    greetings: 0,
  })

  reaction(() => {
    console.log(`Greetings delivered: ${state.greetings}`)
  })

  reaction(() => {
    console.log(state.message)
    state.greetings += 1
  })
})
