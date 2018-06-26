const math = require('mathjs')

const pvNode = math.parse('fv * e^-(r * t)')
let pvCode = pvNode.compile()

let Calculator = {
  pv(...args) {
    let [fv, r, t] = args.map(arg => math.bignumber(arg))
    return pvCode.eval({ fv, r, t })
  }
}

module.exports = Calculator
