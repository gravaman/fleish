import React, { Component } from 'react'
import classNames from 'classnames'
import Square from './Square.js'
import './Board.css'

function Overlay(props) {
  let overlayClass = classNames({
    'replay-overlay': true,
    'replay-overlay-active': props.winner !== null
  })

  return (
    <div className={ overlayClass }>
      <button
        className="replay-btn"
        onClick={ props.onReplay }
      >
        <i className="fa fa-repeat fa-5x"></i>
      </button>
    </div>
  )
}

function SquaresList(props) {
  const { squares, onClick } = props
  const listItems = squares.map((player, index) => (
      <div
        className={'position-' + index }
        key={ index.toString() }
      >
        <Square
          value={ player }
          onClick={ () => onClick(index) }
        />
      </div>
    )
  )
  return (
    <div className="board-container">
      { listItems }
    </div>
  )
}

class Board extends Component {
  render() {
    return (
      <div>
        <Overlay
          winner={ this.props.winner }
          onReplay={ this.props.onReplay }
        />
        <SquaresList
          squares={ this.props.squares }
          onClick={ this.props.onClick }
        />
      </div>
    )
  }
}

export default Board
