import React, { Component } from 'react'
import Square from './Square.js'
import './Board.css'

class Board extends Component {
  renderReplay() {
    return (
      <div
        className={ this.props.winner !== null ? "replay-overlay-active" : "replay-overlay" }
      >
        <button
          className="replay-btn"
          onClick={ this.props.onReplay }
        >
          <i className="fa fa-repeat fa-5x"></i>
        </button>
      </div>
    )
  }
  renderSquare(i) {
    const player = this.props.squares[i]
    return (
      <div className={ 'position-' + i }>
        <Square
          value={ player }
          onClick={ () => this.props.onClick(i) }
          imgUrl={ this.playerToUrl(player) }
        />
      </div>
    )
  }

  playerToUrl(player) {
    const playerImg = '/images/mg-hawk-1955.jpg'
    const aiImg = '/images/willys-jeep.jpeg'

    if (!player) {
      return null
    }
    return player === 1 ? playerImg : aiImg
  }

  render() {
    return(
      <div>
        { this.renderReplay() }
        <div className="board-container">
            { this.renderSquare(0) }
            { this.renderSquare(1) }
            { this.renderSquare(2) }
            { this.renderSquare(3) }
            { this.renderSquare(4) }
            { this.renderSquare(5) }
            { this.renderSquare(6) }
            { this.renderSquare(7) }
            { this.renderSquare(8) }
        </div>
      </div>
    )
  }
}

export default Board
