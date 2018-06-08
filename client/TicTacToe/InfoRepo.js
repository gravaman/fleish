import React, { Component } from 'react'
import './InfoRepo.less'

class InfoRepo extends Component {
  getStatus() {
    console.log('checking status')
    if (this.props.winner === 1) {
      return 'Victory'
    }
    if (this.props.winner === 2) {
      return 'Defeat'
    }
    return 'in-progress'
  }

  render() {
    return(
      <div>
        <h2>console</h2>
        <div className="info-row">
          <span className="title">status</span>
          <span className="data">{ this.getStatus() }</span>
        </div>
        <div className="spacer-row"></div>
        <div className="info-row">
          <div className="spacer-title"></div>
          <span className="data-header">count</span>
          <span className="data-header">rate</span>
        </div>
        <div className="info-row">
          <span className="title">win</span>
          <span className="data">0</span>
          <span className="data">0</span>
        </div>
        <div className="info-row">
          <span className="title">loss</span>
          <span className="data">0</span>
          <span className="data">0</span>
        </div>
        <div className="info-row">
          <span className="title">draw</span>
          <span className="data">0</span>
          <span className="data">0</span>
        </div>
        <div className="spacer-row"></div>
        <div className="info-row">
          <button
            className="data"
            onClick={ () => this.props.onReplay() }
          >
            replay
          </button>
        </div>
      </div>
    )
  }
}

export default InfoRepo
