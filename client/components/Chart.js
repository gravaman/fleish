import React, { Component } from 'react'
import { VictoryChart, VictoryTheme, VictoryLine } from 'victory'
import Styler from '../styler'

class Chart extends Component {
  render() {
    return (
      <VictoryChart
        theme={ VictoryTheme.material }
      >
        <VictoryLine
          style={{ data: { stroke: Styler.mainCharcoal } }}
          data={ this.props.data }
        />
      </VictoryChart>
    )
  }
}

export default Chart
