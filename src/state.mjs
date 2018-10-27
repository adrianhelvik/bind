import Manager from './Manager.mjs'

const glob = typeof global === 'undefined'
  ? window
  : global

const s_manager = Symbol.for('@adrianhelvik/bind/manager')
let s_multipleVersionsDetected = Symbol.for('@adrianhelvik/bind/manager/multipleDetected')

if (glob[s_manager]) {
  console.warn(
    'You have multiple active instances of @adrianhelvik/bind!\n\n' +
    'This could be because of an external dependency. ' +
    'You should contact its maintainer and ask then to include ' +
    'the library as a peer dependency.\n\n' +
    'In the mean time, we will reuse the internal state from the ' +
    'previous inclusion of the library.'
  )
  glob[s_multipleVersionsDetected] = true
} else {
  glob[s_manager] = new Manager()
}

/**
 * Disconnects all observables. This will
 * make existing observables become
 * irrvokably non-observable.
 *
 * Made for use in testing.
 *
 * As you can see, it can not be called
 * when multiple versions are detected,
 * as this would mean that each instance
 * would refer to a different manager.
 */
export function resetInternalState() {
  if (glob[s_multipleVersionsDetected])
    throw Error('There were multiple versions of the library detected. Can not reset internal state')
  manager = new Manager()
  glob[s_manager] = manager
}

export let manager = glob[s_manager]
