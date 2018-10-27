# @adrianhelvik/bind

This is an ES6 only observable library. It is havily inspired
by mobx, but has a few key differences.

## Usage example

```javascript
import {observable, autorun, memoize, action} from '@adrianhelvik/bind'

const state = observable({
  seconds: 0,
  items: observable([
    observable({
      title: 'foo'
    })
  ])
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
```
