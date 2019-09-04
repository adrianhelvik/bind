import {
  revertTransaction,
  transaction,
  observable,
  reaction,
  memoize,
  batch,
  debug,
} from '../src/index.mjs'

import markdown from '../markdown.mjs'

const sleep = t => new Promise(r => setTimeout(r, t))

const assert = function assert(value, message) {
  if (! value) {
    throw Error(message || 'Assertion failed')
  }
}

assert.equal = function assertEqual(actual, expected) {
  assert(actual === expected, `Expected ${actual} to equal ${expected}`)
}

markdown`

# @bind/core

## Observables
An observable is an object that can be tracked by Bind.
You can create an observable by calling the \`observable\`
function, on an object or without an argument.

It supports objects, arrays, Map, Set and more.

${() => {
  observable()
  observable({ message: 'Hello world' })
  observable([])
}}

## Transactions
Runs a set of updates in a transaction. If an error is
thrown during the transaction, all updates are reversed.

Ensure that no side effects that mutate non-observables
happpen in the transaction. Only changes to observables
can be reverted.

${() => {
  const state = observable({
    number: 0,
  })

  try {
    transaction(() => {
      state.number += 1
      console.log(`Number before error was thrown: ${state.number}`)

      throw Error('Canceling the transaction')
    })
  } catch (e) {
    console.log(`Caught error: ${e.message}`)
  }

  console.log(`The number is then reset to ${state.number}`)
}}

### Manually reverting a transaction

${() => {
  const state = observable({
    number: 0,
  })

  const t = transaction(() => {
    state.number += 1
    state.number += 1
    state.number += 1
  })

  revertTransaction(t)

  assert.equal(state.number, 0)
}}

## memoize
\`memoize\` accepts a function and returns a memoized version
of it.

The first time the memoized function is run, the target function
also runs. All observable properties that are accessed within the
function is stored, and an update listener is added to each of
these.

When an observable that is depended upon in the function is
changed, the function is marked as "dirty". If a memoized function
is dirty when called, its result and dependencies are recalculated.

${() => {
  const state = observable({
    firstName: 'Peter',
    lastName: 'Parker',
  })

  const fullName = memoize(() => {
    console.log('Calulating full name...')
    return `${state.firstName} ${state.lastName}`
  })

  console.log(fullName())
  console.log(fullName())
  state.firstName = 'Clara'
  console.log(fullName())
}}

## reaction

A reaction is called whenever its dependencies change.
This can be useful if you want a change in some observable
state to trigger side effects.

${() => {
  const state = observable({
    count: 0,
  })

  reaction(() => {
    // As state.count is used here,
    // the reaction will be called
    // whenever the count updates.
    console.log(`Count: ${state.count}`)
  })

  console.log('^ The reaction is called once immediately')

  state.count += 1
  state.count += 1
  state.count += 1

  console.log('^ And once every time state it depends on is updated')
}}

## batch

Sometimes you don't want more than one reaction after an update.
Say you update multiple pieces of state for a React component,
you don't want to render once for every change.

${() => {
  const state = observable({
    count: 0,
  })

  reaction(() => {
    // As state.count is used here,
    // the reaction will be called
    // whenever the count updates.
    console.log(`Count: ${state.count}`)
  })

  console.log('^ The reaction is called once immediately')

  batch(() => {
    state.count += 1
    state.count += 1
    state.count += 1
  })

  console.log('^ And once after the batch')
}}

## batch using promises

${async () => {
  const state = observable({
    message: 'Initial message'
  })

  reaction(() => {
    console.log(`The message is: ${state.message}`)
  })

  await batch(async () => {
    state.message = 'This is never displayed'
    await sleep(100)
    state.message = 'Final message'
  })
}}
`
