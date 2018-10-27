# @adrianhelvik/bind

This is an ES6 only observable library. It is havily inspired
by Mobx, but has a few key differences. Its api does not use
decorators and just like the latest version of Mobx, it uses
non-polyfillable Proxies.

## Usage example

```javascript
import {observable, autorun, memoize, action} from '@adrianhelvik/bind'

const state = observable({
  seconds: 0,
  items: observable([
    observable({
      title: 'foo'
    })
  ]),
})

// When the autorun function is called
// with another function, the other
// function is immediately invoked.
autorun(() => {

  // And every time a property of an observable
  // is accessed within the autorun function,
  // it is logged.
  console.log(`You have spent ${state.seconds}s`)
})

// So that whenever you set a property
// of an observable, it will in turn
// cause the function passed to the
// observable to be invoked and the
// tracked properties to be updated.
setInterval(() => {

  // When a property is set on an
  // observable, it is wrapped in
  // an action behind the scenes.
  // When an action is in progress,
  // changes are tracked.
  state.seconds += 1
})

// We also have memoized functions. These
// behave just like normal functions,
// except for two things. Their arguments
// are ignored and the actual function
// will only be called when state used
// in the function has changed.
let callCount = 0
const secondsSquared = memoize(() => {
  callCount += 1
  return state.seconds ** 2
})

// Let's first update the seconds in
// state to a more interesting value
// than 0
state.seconds = 10

// Before the function has been called,
// the call count is 0. The value has
// not been computed yet.
console.log(callCount) // Prints: 0

// Now we compute the value by using
// the function just like any other
// function.
console.log(secondsSquared()) // Prints 100

// The call count is now at 1
console.log(callCount) // Prints: 1

// But calling the function multiple
// times does not increment the call count.
secondsSquared()
secondsSquared()
secondsSquared()
console.log(callCount) // Prints: 1

// When we change the seconds in the state,
// our memoized function has still not been
// called.
state.seconds = 4
console.log(callCount) // Prints: 1

// But when we call it again, it is incremented
// as an observable binding used in the function
// was changed.
console.log(secondsSquared()) // Prints: 16
console.log(callCount) // Prints: 2
```
