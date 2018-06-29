let Seeder = {
  setState: function(update) {
    Object.assign(this.state, update)
  },
  inverse: function(s1) {
    let { mask0, base } = this.state
    return (~s1 & mask0) | base
  },
  addData: function(s1) {
    let { data } = this.state
    let inverse = this.inverse(s1)
    data = data.slice()

    !data.includes(s1) && data.push(s1)
    !data.includes(inverse) && data.push(inverse)

    this.setState({ data })
  },
  buildData: function(size) {
    let { base, length, mask0 } = this.state
    let s0 = base

    for (let i = 0; i <= length; i++) {
      let s1 = (s0 >> i) | base
      this.addData(s1)

      for (let j = i; j < length; j++) {
        let s3 = (s1 >> i) | base
        this.addData(s3)

        for (let k = i; k < length; k++) {
          let mask1 = mask0 >> 1
          let s5 = (s3 & mask1) >> i | base
          this.addData(s5)
        }
      }
    }
  },
  getSeeds() {
    let { data } = this.state
    return data.map(bin => bin.toString(2).split('').slice(1))
  }
}

function getSeeds(keys) {
  let size = keys.length
  let seed = Object.create(Seeder)
  seed.state = {
    length: size,
    base: parseInt('1' + '0'.repeat(size), 2),
    mask0: parseInt('1'.repeat(size + 1), 2),
    data: []
  }

  seed.buildData(size)
  return seed.getSeeds()
}

module.exports = { getSeeds }
