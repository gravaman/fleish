import React, { Component } from 'react'
import ReactTooltip from 'react-tooltip'
import Colorize from './Colorize'
import './HubSpokeCharts.css'

function Wrapper(props) {
  function hasPlayed(data) {
    return Object.values(data).reduce((a, b) => a + b) > 0
  }

  function getLengths(data, viewBox) {
    if (!hasPlayed(data)) {
      return [ viewBox.width, 0, 0 ]
    }
    const total = Object.values(data).reduce((a, b) => a + b)
    return ['wins', 'draws', 'losses'].map(key => data[key] / total * viewBox.width)
  }

  function getColors(data) {
    if (!hasPlayed(data)) {
      return [ Colorize.gray, Colorize.gray, Colorize.red ]
    }
    return [ Colorize.green, Colorize.gray, Colorize.red ]
  }

  function getStrokeWidths(data) {
    return hasPlayed(data) ? [1, 4, 1] : [1, 1, 1]
  }

  const { chartType } = props
  const viewBox = {
    x: 0,
    y: 0,
    width: 100,
    height: 25
  }
  const [ wLength, dLength, lLength ] = getLengths(props.data, viewBox)
  const [ wColor, dColor, lColor ] = getColors(props.data)
  const [wStrokeWidth, dStrokeWidth, lStrokeWidth ] = getStrokeWidths(props.data)
  const startY = viewBox.y + viewBox.height / 2

  let winsD = [
    `M${ viewBox.x } ${ startY } h 0`,
    `M${ viewBox.x } ${ startY } h ${ wLength }`,
    `M${ viewBox.x } ${ startY } h ${ wLength }`
  ]
  let drawsD = [
    `M${ viewBox.x + wLength } ${ startY } h 0`,
    `M${ viewBox.x + wLength } ${ startY } h 0`,
    `M${ viewBox.x + wLength } ${ startY } h ${ dLength }`,
    `M${ viewBox.x + wLength } ${ startY } h ${ dLength }`
  ]
  let lossesD = [
    `M${ viewBox.x + wLength + dLength } ${ startY } h 0`,
    `M${ viewBox.x + wLength + dLength } ${ startY } h 0`,
    `M${ viewBox.x + wLength + dLength } ${ startY } h 0`,
    `M${ viewBox.x + wLength + dLength } ${ startY } h ${ lLength }`
  ]
  const duration = '1s'
  const winsPath = (
    <path
      d={ winsD[winsD.length - 1] }
      stroke={ wColor }
      strokeWidth={ wStrokeWidth }
    >
      <animate
        attributeName='d'
        dur={ duration }
        keyTimes='0; 0.33; 1'
        values={ winsD.join('; ').concat(';') }
      />
    </path>
  )

  const drawsPath = (
    <path
      d={ drawsD[drawsD.length - 1] }
      stroke={ dColor }
      strokeWidth={ dStrokeWidth }
    >
      <animate
        attributeName='d'
        dur={ duration }
        keyTimes='0; 0.33; 0.66; 1'
        values={ drawsD.join('; ').concat(';') }
      />
    </path>
  )

  const lossesPath = (
    <path
      d={ lossesD[lossesD.length - 1] }
      stroke={ lColor }
      strokeWidth={ lStrokeWidth }
    >
      <animate
        attributeName='d'
        dur={ duration }
        keyTimes='0; 0.33; 0.66; 1'
        values={ lossesD.join('; ').concat(';') }
      />
    </path>
  )

//   <defs>
//     <linearGradient id='winGradient'>
//       <stop offset='5%' stopColor={ Colorize.green } stopOpacity="10%"/>
//       <stop offset='10%' stopColor={ Colorize.gray } stopOpacity="50%"/>
//       <stop offset='50%' stopColor={ Colorize.red } stopOpacity="80%"/>
//     </linearGradient>
//   </defs>
//   <path
//     d={ winsD[winsD.length - 1] }
//     stroke="url(#winGradient)"
//     strokeWidth={ 5 }
//   />
//   <animate
//     attributeName='d'
//     dur={ duration }
//     keyTimes='0; 0.33; 1'
//     values={ winsD.join('; ').concat(';') }
//   />
// </path>

  return (
    <svg
      width='100%'
      height='100%'
      viewBox={ [viewBox.x, viewBox.y, viewBox.width, viewBox.height].join(' ') }
      className={ `chart-${ chartType }` }
    >
    { winsPath }
    { drawsPath }
    { lossesPath }
    </svg>
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
        <ReactTooltip />
      </div>
    )
  }
}

export default SeriesChart
