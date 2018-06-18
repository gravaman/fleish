import React, { Component } from 'react'
import classNames from 'classnames'
import Square from './Square.js'
import './Board.css'

function Overlay(props) {
  let overlayClasses = classNames({
    'replay-overlay-active': props.winner !== null
  })

  let messageClasses = classNames({
    'result-msg': true,
    'result-msg-draw': props.winner === 0,
    'result-msg-victory': props.winner === 1,
    'result-msg-defeat': props.winner === 2
  })

  return (
    <div className={ overlayClasses }>
      <h2 className={ messageClasses }>{ ['Draw :|', 'Victory :)', 'Defeat :('][props.winner] }</h2>
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
        className={'base-square position-' + index }
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
  constructor(props) {
    super(props)
    this.state = {
      showOverlay: false
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.winner !== this.props.winner) {
      let showOverlay = this.props.winner !== null
      this.setState({ showOverlay })
    }
  }

  render() {
    return (
      <div>
        { this.state.showOverlay && (
          <Overlay
            winner={ this.props.winner }
            onReplay={ this.props.onReplay }
          />)}
        <SquaresList
          squares={ this.props.squares }
          onClick={ this.props.onClick }
        />
      </div>
    )
  }
}

export default Board
