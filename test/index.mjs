main()

async function main() {
  mocha.setup('bdd')

  await import('https://unpkg.com/chai@4.2.0/chai.js')
  global.expect = chai.expect

  await import('./Atom.mjs')
  await import('./Manager.mjs')
  await import('./ObservableArray.mjs')
  await import('./autorun.mjs')
  await import('./createObservableObject.mjs')
  await import('./memoize.mjs')

  mocha.checkLeaks()
  mocha.run()
}
