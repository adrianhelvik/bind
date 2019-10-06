# @adrianhelvik/bind

## Observables
The properties of an observable object is tracked by Bind.
You can create one yourself like this:


```javascript
  import { observable } from '@adrianhelvik/bind'

  observable()
  observable({ message: 'Hello world' })
  observable([1, 2, 3])
```



## How it all works: Tracking bindings
What we actually do when we create an observable is that
we intercept property getters and setters while we keep
track of accessed and updated properties.

This can be demonstrated with the track function.


```javascript
  import { observable, track } from '@adrianhelvik/bind'

  const state = observable()

  const { accessed, updated } = track(() => {
    state.hello = 'world' // Updated 'world'
    state.foo = 'bar'     // Updated 'foo'
    state.hello           // Accessed 'hello'
  })

  console.log('Updated:', updated)
  console.log('Accessed:', accessed)
```

#### Output
```
  Updated: Set([ Binding('hello'), Binding('foo') ])
  Accessed: Set([ Binding('hello') ])
```


We can use the information gathered by the track function
to determine what has been updated and accessed within a
function.

Let's use this for something interesting!

## Memoized functions

When a function is memoized, the return value is cached. It will
return this cached value on subsequent calls until a dependency
has been changed.

When a property the function depends on has been changed (such as
`firstName` in the example below), the cache is removed and
must be calculated on the next call.


```javascript
  import { observable, memoize, debug } from '@adrianhelvik/bind'

  const state = observable({
    firstName: 'Peter',
    lastName: 'Parker',
  })

  const fullName = memoize(() => {
    console.log('Calulating full name...')
    return `${state.firstName} ${state.lastName}`
  })

  a:
  console.log(fullName())

  b:
  console.log(fullName())

  c:
  debug(() => {
    state.firstName = 'Clara' // This resets the cache of fullName
  })

  d:
  console.log(fullName())
```

#### Output
```
  a:
  Calulating full name...
  Peter Parker
  
  b:
  Peter Parker
  
  c:
  [debug]: Updated observable property 'firstName' to: Clara
  [debug]: Cache reset for memoized function
  
  d:
  Calulating full name...
  Clara Parker
```


**a:** The memoized function is called for the first time, and
   has to be calculated.

**b:** The memoized function returns the cached value.

**c:** Setting `firstName` resets the cache.

**d:** The value has to be calculated.

## Reacting to state changes

Memoized functions are great, but wouldn't it be great
if the function was called automatically when its state
changes?

That is what `reaction()` does!


```javascript
  const state = observable({
    count: 0,
  })

  reaction(() => {
    // As state.count is used here,
    // this function will be called
    // whenever the count updates.
    console.log(`Count: ${state.count}`)
  })

  state.count += 1
  state.count += 1
  state.count += 1

```

#### Output
```
  Count: 0
  ^ The reaction is called once when the reaction is created
  Count: 1
  Count: 2
  Count: 3
  ^ And once every time state it depends on is updated
```


If you provide a second function, the second function is
called only when the first one returns a truthy value.

If you provide a third function, the third function is
called only when the first one returns a falsey value.


```javascript
  const state = observable({
    count: 0,
  })

  const cancelReaction = reaction(() => {
    console.log(`The count is ${state.count}`)
    return state.count < 5
  }, () => {
    console.log('Incrementing count...')
    state.count += 1
  }, () => {
    console.log('Count wasn\'t less than 5')
  })
```

#### Output
```
  The count is 0
  Incrementing count...
  The count is 1
  Incrementing count...
  The count is 2
  Incrementing count...
  The count is 3
  Incrementing count...
  The count is 4
  Incrementing count...
  The count is 5
  Count wasn't less than 5
```


## Batching updates

Sometimes you don't want more than one reaction, but you
need to make multiple updates.

For example: When you update multiple pieces of state for
a React component, you don't want to render once for
every change.


```javascript
  const state = observable({
    count: 0,
  })

  reaction(() => {
    // As state.count is used here,
    // the reaction will be called
    // whenever the count updates.
    console.log(`Count: ${state.count}`)
  })

  batch(() => {
    state.count += 1
    state.count += 1
    state.count += 1
  })

```

#### Output
```
  Count: 0
  ^ The reaction is called once when it is created
  Count: 3
  ^ And once after the batch
```


## Transactions
Runs a set of updates in a transaction. If an error is
thrown during the transaction, all updates are reversed.

Ensure that no side effects that mutate non-observables
happpen in the transaction. Only changes to observables
can be reverted.

*Transactions and reversed of transactions are batched.*

### State is recovered if a transaction fails


```javascript
  const state = observable({
    number: 0,
  })

  try {
    transaction(() => {
      state.number += 1
      console.log(`Number before error was thrown: ${state.number}`)
      throw Error('-- Transaction cancelled --')
    })
  } catch (e) {
    console.log(`${e.message}`)
  }

  console.log(`The number was reset to ${state.number}`)
```

#### Output
```
  Number before error was thrown: 1
  -- Transaction cancelled --
  The number was reset to 0
```


### A transaction can also be reverted manually


```javascript
  import {
    revertTransaction,
    transaction,
    observable,
  } from '@adrianhelvik/bind'

  const state = observable({
    number: 0,
  })

  const t = transaction(() => {
    state.number += 1
    state.number += 1
    state.number += 1
  })

  console.log('Number before reversal:', state.number)

  revertTransaction(t)

  console.log('Number after reversal:', state.number)
```

#### Output
```
  Number before reversal: 3
  Number after reversal: 0
```


Transactions can be used to implement undo/redo, and
to prevent inconsistent states.
