import observable from '../src/observable.mjs'
import autorun from '../src/autorun.mjs'
import markdown from '../markdown.mjs'

markdown`

# Overview
Bind is inspired by Mobx to a very large extent.
There are however some important differences.

${() => {
  const state = observable()

  autorun(() => {
    console.log(`The message is: '${state.message}'`)
  })

  state.message = 'Hello world'
  state.message = 'Updated'
}}

As you can see from this example, we are notified
when a property on an observable object changes.

Objects are also deeply observable.

${() => {
  const state = observable()

  autorun(() => {
    console.log(state && state.foo && state.foo.bar && state.foo.bar.baz || 'state.foo.bar.baz was not set yet')
  })


  console.log("Let's set state.foo")
  state.foo = {}

  console.log("Let's set state.foo.bar")
  state.foo.bar = {}

  console.log("Let's set state.foo.bar.baz")
  state.foo.bar.baz = 'Hello world!'
}}
`
