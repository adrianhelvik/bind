class Atom {
  constructor(manager, name) {
    this.manager = manager
    this.name = name
  }

  updated() {
    this.manager.addUpdated(this)
  }

  accessed() {
    this.manager.addAccessed(this)
  }
}

export default Atom
