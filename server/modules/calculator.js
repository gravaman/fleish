const math = require('mathjs')

math.config({
  number: 'BigNumber',
  precision: 64
})

const pvCode = math.parse('fv * e^-(r * t)').compile()
const pvdxCode = math.parse('-fv * t * e^-(r*t)').compile()
const couponPmtCode = math.parse('t * r * p').compile()
const newtRootCode = math.parse('x0 - y / dy').compile()
const stableCode = math.parse('abs(x1 - x0) <= theta').compile()
const compoundMCode = math.parse('m * (e^(rc / m) - 1)')
const continuousMCode = math.parse('m * ln(1 + rm / m)')

function biggify(argsObj) {
  Object.entries(argsObj)
    .forEach(([key, val]) => {
      if (typeof val === 'number') {
        argsObj[key] = math.bignumber(val)
      }
    })
  return argsObj
}

let Calculator = {
  pv({ ...args }) {
    let { fv, r, t } = biggify(args)
    return pvCode.eval({ fv, r, t })
  },
  pvdx({ ...args }) {
    let { fv, r, t } = biggify(args)
    return pvdxCode.eval({ fv, r, t })
  },
  couponPmt({ ...args }) {
    let { t, r, p } = biggify(args)
    return couponPmtCode.eval({ t, r, p })
  },
  newtRoot({ ...args }) {
    let { x0, y, dy } = biggify(args)
    return newtRootCode.eval({ x0, y, dy })
  },
  stable({ ...args }) {
    let { x0, x1, theta } = biggify(args)
    return stableCode.eval({ x0, x1, theta })
  },
  compoundM({ ...args }) {
    let { m, rc } = biggify(args)
    return compoundMCode.eval({ m, rc })
  },
  continousM({ ...args }) {
    let { m, rm } = biggify(args)
    return continuousMCode.eval({ m, rm })
  },
  neg(num) {
    return math.unaryMinus(biggify(num))
  }
}

module.exports = Calculator
