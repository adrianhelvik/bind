import observable from '../src/observable.mjs'
import autorun from '../src/autorun.mjs'
import markdown from '../markdown.mjs'

markdown`

# Overview of @adrianhelvik/bind

## Observables
An \`observable\` is an object that can be tracked Bind.
You can create an observable by calling the observable
function.

${() => {
  const state = observable()
}}

You can use the observable as any other object.

${() => {
  const state = observable()
  // @start
  state.message = 'Hello world'
}}

The interesting thing about observable state is that
you can react when it changes. Let's use the object
we just created as an example.

${() => {
  const state = observable()
  state.message = 'Hello world'
  // @start
  autorun(() => {
    console.log(`The message is "${state.message}"`)
  })

  state.message = 'A new message'
}}

As you could see, the function ran twice. This is
because it had to track its dependencies. Accessing
a property on an observable object within an autorun
function will cause the function to re-run when
the property changes.
`
  /*






Bind is heavily inspired by Mobx, and is very similar.

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
*/
