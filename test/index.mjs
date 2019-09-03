main()

window.onerror = error => {
  console.error(error)
}

async function main() {
  mocha.setup('bdd')

  await import('https://unpkg.com/chai@4.2.0/chai.js')
  global.expect = chai.expect

  await import('./transaction.mjs')
  await import('./Atom.mjs')
  await import('./Manager.mjs')
  await import('./autorun.mjs')
  await import('./observable.mjs')
  await import('./computed.mjs')

  mocha.checkLeaks()
  mocha.run()
}
