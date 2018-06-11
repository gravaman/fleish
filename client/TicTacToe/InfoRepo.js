import React, { Component } from 'react'
import './InfoRepo.css'

class InfoRepo extends Component {
  getStatus() {
    return this.props.winner === null ? 'playing' : this.getResult()
  }

  getResult() {
    return [ 'draw', 'victory', 'defeat' ][this.props.winner]
  }

  getEmoji() {
    return [ ':P', ':)', ':(' ][this.props.winner]
  }

  renderStatRow(title, result) {
    let total = this.props.seriesStats.wins + this.props.seriesStats.losses + this.props.seriesStats.draws
    let rate = total > 0 ? result / total : '--'
    return (
      <div>
        <span>{ title }</span>
        <span>{ result }</span>
        <span>{ rate }</span>
      </div>
    )
  }

  render() {
    return(
      <div className="info-container">
        <div className="series-chart"></div>
        <div className="ai-chart"></div>
      </div>
    )
  }
}

export default InfoRepo
