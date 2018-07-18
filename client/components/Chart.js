import React, { Component } from 'react'
import { VictoryChart, VictoryTheme, VictoryLine } from 'victory'
import Styler from '../styler'


const dataStyle = {
  data: {
    stroke: Styler.mainCharcoal,
    strokeLinecap: 'round'
  }
}

class Chart extends Component {
  render() {
    return (
      <VictoryChart
        theme={ VictoryTheme.material }
      >
        <VictoryLine
          interpolation='natural'
          style={ dataStyle }
          data={ this.props.data }
        />
      </VictoryChart>
    )
  }
}

export default Chart
