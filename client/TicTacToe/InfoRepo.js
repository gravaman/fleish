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
      <div className="info-row">
        <span className="title">{ title }</span>
        <span className="data">{ result }</span>
        <span className="data">{ rate }</span>
      </div>
    )
  }

  render() {
    return(
      <div className="info-repo">
        <div className="spacer-row"></div>
        <div className="info-row">
          <span className="title">status</span>
          <span className="spacer-data"></span>
          <span className="data">{ this.getStatus() }</span>
        </div>
        <div className="spacer-row"></div>
        <div className="info-row">
          <div className="spacer-title"></div>
          <span className="data-header">count</span>
          <span className="data-header">rate</span>
        </div>
        { this.renderStatRow('wins', this.props.seriesStats.wins) }
        { this.renderStatRow('losses', this.props.seriesStats.losses) }
        { this.renderStatRow('draws', this.props.seriesStats.draws) }
        <div className="spacer-row"></div>
        <div className="info-row">
          <button
            className="data"
            onClick={ () => this.props.onReplay() }
          >
            <i className="fa fa-repeat"></i>
          </button>
        </div>
        <div className="spacer-row"></div>
      </div>
    )
  }
}

export default InfoRepo
