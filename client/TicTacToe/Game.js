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

  get squares() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    return current.squares
  }

  copySquares() {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    return current.squares.slice()
  }

  handleClick(i) {
    const squares = this.copySquares()
    if (utilities.calculateWinner(squares) || squares[i]) {
      return
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O'
    this.setState({
      history: this.state.history.concat([
        { squares: squares }
      ]),
      stepNumber: this.state.history.length,
      xIsNext: !this.state.xIsNext
    })
  }

  render() {
    return(
      <div className="game">
        <Board
          squares={ this.squares }
          onClick={ i => this.handleClick(i) }
        />
      </div>
    )
  }
}

export default Game
