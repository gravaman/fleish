import React, { Component } from 'react'
import Square from './Square.js'
import './Board.less'

class Board extends Component {
  renderSquare(i) {
    const player = this.props.squares[i]
    return (
      <Square
        value={ player }
        onClick={ () => this.props.onClick(i) }
        imgUrl={ this.playerToUrl(player) }
      />
    )
  }

  playerToUrl(player) {
    if (!player) {
      return null
    }
    return player === 1 ? this.props.playerImg : this.props.aiImg
  }

  render() {
    return(
      <div className='board'>
        <div className='board-row'>
          { this.renderSquare(0) }
          { this.renderSquare(1) }
          { this.renderSquare(2) }
        </div>
        <div className='board-row'>
          { this.renderSquare(3) }
          { this.renderSquare(4) }
          { this.renderSquare(5) }
        </div>
        <div className='board-row'>
          { this.renderSquare(6) }
          { this.renderSquare(7) }
          { this.renderSquare(8) }
        </div>
      </div>
    )
  }
}

export default Board
