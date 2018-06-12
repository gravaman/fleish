import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip'
import './HubSpokeCharts.css'

function Rect(props) {
  let { x, y, width, height, fill, onMouseOver, dataKey, value } = props.data
  return (
    <rect
      x={ x + '%' }
      y={ y + '%' }
      width={ width + '%' }
      height={ height + '%' }
      fill={ fill }
      data-tip={ dataKey + ': ' + value }
    />
  )
}

function Wrapper(props) {
  const { wins, losses, draws } = props.data
  const { chartType } = props
  const total = wins + losses + draws

  const margin = 5
  const svgContent = {
    width: 100 - margin * 2,
    height: 100 - margin * 2
  }
  const spokeHeight = 1
  const hubHeight = 10

  const winsSpoke = {
    x: 0,
    y: svgContent.height / 2 + margin - spokeHeight / 2,
    width: total === 0 ? svgContent.width / 3 : wins / total * svgContent.width,
    height: spokeHeight,
    fill: total === 0 ? 'gray' : 'green',
    onMouseOver: () => console.log('wins:', wins),
    dataKey: 'wins',
    value: wins
  }

  const drawsHub = {
    x: winsSpoke.x + winsSpoke.width,
    y: svgContent.height / 2 + margin - hubHeight / 2,
    width: total === 0 ? svgContent.width / 3 : draws / total * svgContent.width,
    height: hubHeight,
    fill: total === 0 ? 'gray' : 'blue',
    onMouseOver: () => console.log('draws:', draws),
    dataKey: 'draws',
    value: draws
  }

  const lossesSpoke = {
    x: drawsHub.x + drawsHub.width,
    y: svgContent.height / 2 + margin - spokeHeight / 2,
    width: total === 0 ? svgContent.width / 3 : losses / total * svgContent.width,
    height: spokeHeight,
    fill: total === 0 ? 'gray' : 'red',
    onMouseOver: () => console.log('losses:', losses),
    dataKey: 'losses',
    value: losses
  }

  return (
    <div className={ `chart-${ chartType}` }>
      <svg
        y={ margin + '%' }
        width={ svgContent.width + '%'}
        height={ svgContent.height + '%' }
      >
        <Rect data={ winsSpoke } />
        <Rect data={ drawsHub } />
        <Rect data={ lossesSpoke } />
      </svg>
      <ReactTooltip />
    </div>
  )
}

function Legend(props) {
  const { wins, losses, draws } = props.data
  const { titleType } = props
  return (
    <div className={ 'title-' + titleType }>
      { titleType }
      <br></br>
      { `(${ wins }-${ draws }-${ losses })` }
    </div>
  )
}

class SeriesChart extends Component {
  render() {
    let worldData = {
      wins: 1000,
      losses: 503,
      draws: 2345
    }
    return (
      <div className="chart-container">
        <Legend data={ this.props.seriesStats } titleType='series' />
        <Wrapper data={ this.props.seriesStats } chartType='series' />
        <Legend data={ worldData } titleType='world' />
        <Wrapper data={ worldData } chartType='world' />
      </div>
    )
  }
}

export default SeriesChart
