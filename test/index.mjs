main()

window.onerror = error => {
  console.error(error)
}

async function main() {
  mocha.setup('bdd')

  await import('https://unpkg.com/chai@4.2.0/chai.js')
  global.expect = chai.expect

  await import('./transaction.mjs')
  await import('./Binding.mjs')
  await import('./Manager.mjs')
  await import('./reaction.mjs')
  await import('./observable.mjs')
  await import('./memoize.mjs')

  mocha.checkLeaks()
  mocha.run()
}
