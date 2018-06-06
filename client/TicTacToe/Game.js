import React, { Component } from 'react'
import Board from './Board.js'
import utilities from './utilities'
import './Game.less'

class Game extends Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [
        { squares: Array(9).fill(null) }
      ],
      stepNumber: 0,
      xIsNext: true
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    if (utilities.calculateWinner(squares) || squares[i]) {
      return
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O'
    this.setState({
      history: history.concat([
        { squares: squares }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    })
  }

  render() {
    const history = this.state.history
    const current = history[this.state.stepNumber]

    return(
      <div className="game">
        <Board
          squares={ current.squares }
          onClick={ i => this.handleClick(i) }
        />
      </div>
    )
  }
}

export default Game
