let Calendar = require('./calendar')
let Calculator = require('./calculator')
let { getPvs } = require('./pver')

function weightPmts(pvs, order = 1) {
  return pvs.reduce((acc, pv) => {
    let t = Calculator.multiply(order, pv.timeFromNow())
    let tc = Calculator.multiply(t, pv.amount)
    return Calculator.add(acc, tc)
  }, 0)
}

function calcMacD(props) {
  let { fvs, m, y, px, entry } = props
  let pvs = getPvs({ fvs, rm: y, m, entry })
  let weighted = weightPmts(pvs, 1)
  return Calculator.divide(weighted, px)
}

function calcMacC(props) {
  let { fvs, m, y, px, entry } = props
  let pvs = getPvs({ fvs, rm: y, m, entry })
  let weighted = weightPmts(pvs, 2)
  return Calculator.divide(weighted, px)
}

let DurationHandler = {
  setup: function({ fvs, m, y, px, entry }) {
    let nextState = { fvs, m, y, px, entry }
    nextState.macD = calcMacD(nextState)
    nextState.macC = calcMacC(nextState)
    this.state = nextState
    this.update = this.update.bind(this)
  },
  update: function(props) {
    let priorState = Object.assign({}, this.state)
    let nextState = Object.assign(priorState, props)
    nextState.macD = calcMacD(nextState)
    nextState.macC = calcMacC(nextState)

    this.state = nextState
  },
  pxDelta(yDelta) {
    let term1 = Calculator.multiply(this.px, this.modD, yDelta)
    let term2 = Calculator.multiply(0.5, this.px, this.modC, Calculator.pow(yDelta, 2))
    return Calculator.add(term1, term2)
  },
  get macD() {
    return this.state.macD
  },
  get macC() {
    return this.state.macC
  },
  get modD() {
    let adj = Calculator.add(1, Calculator.divide(this.yld, this.frequency))
    return Calculator.divide(this.macD, adj)
  },
  get modC() {
    let adj = Calculator.pow(Calculator.add(1, Calculator.divide(this.yld, this.frequency)), 2)
    let num = Calculator.add(this.macC, Calculator.divide(this.macD, this.frequency))
    return Calculator.divide(num, adj)
  },
  get yld() {
    return this.state.y
  },
  get frequency() {
    return this.state.m
  },
  get px() {
    return this.state.px
  }
}

function durationFactory({ fvs, m, y, px, entry }) {
  let handler = Object.create(DurationHandler)
  handler.setup({ fvs, m, y, px, entry })
  return handler
}

module.exports = durationFactory
