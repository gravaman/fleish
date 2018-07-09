const math = require('mathjs')

math.config({
  number: 'BigNumber',
  precision: 64
})

const pvCode = math.parse('fv * e^-(r * t)').compile()
const pvdxCode = math.parse('-fv * t * e^-(r*t)').compile()
const pvmCode = math.parse('c*(1 + y/k)^-(k*t)').compile()
const couponPmtCode = math.parse('t * r / m * p').compile()
const newtRootCode = math.parse('x0 - y / dy').compile()
const stableCode = math.parse('abs(x1 - x0) <= theta').compile()
const compoundMCode = math.parse('m * (e^(rc / m) - 1)').compile()
const continuousMCode = math.parse('m * log(1 + rm / m)').compile()
const mDurationCode = math.parse('waPvs / px / (1 + y / m)').compile()

function biggify(args) {
  if (Array.isArray(args)) {
    return args.map(arg => typeof arg === 'number' ? math.bignumber(arg) : arg)
  }

  Object.entries(args)
    .forEach(([key, val]) => {
      if (typeof val === 'number') {
        args[key] = math.bignumber(val)
      }
    })
  return args
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
  pvm({ ...args }) {
    let { c, y, k, t } = biggify(args)
    return pvmCode.eval({ c, y, k, t })
  },
  couponPmt({ ...args }) {
    let { t, r, m, p } = biggify(args)
    return couponPmtCode.eval({ t, r, m, p })
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
  continuousM({ ...args }) {
    let { m, rm } = biggify(args)
    return continuousMCode.eval({ m, rm })
  },
  mDuration({ ...args }) {
    let { waPvs, px, y, m } = biggify(args)
    return mDurationCode.eval({ waPvs, px, y, m })
  },
  add(...args) {
    let [ num0, num1 ] = biggify(args)
    return math.add(num0, num1)
  },
  subtract(...args) {
    let [ num0, num1 ] = biggify(args)
    return math.subtract(num0, num1)
  },
  multiply(...args) {
    let bigs = biggify(args)
    return math.multiply(...bigs)
  },
  divide(...args) {
    let [ dividend, divisor ] = biggify(args)
    return math.divide(dividend, divisor)
  },
  pow(...args) {
    let [ base, exp ] = biggify(args)
    return math.pow(base, exp)
  },
  neg(num) {
    num = math.bignumber(num)
    return math.unaryMinus(num)
  },
  round(num, digits = 3) {
    num = math.bignumber(num)
    return math.round(num, digits)
  }
}

module.exports = Calculator
