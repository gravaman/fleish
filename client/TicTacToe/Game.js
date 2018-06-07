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
      winner: null
    }
  }

  get squares() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    return current.squares
  }

  get isPlayerTurn() {
    return this.state.stepNumber % 2 === 0
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const start = history[history.length - 1]
    const playerSquares = start.squares.slice()

    // do nothing if square already played or game is over
    if (playerSquares[i] || this.state.winner) {
      return
    }

    // take player move
    const startSquares = playerSquares.slice()
    playerSquares[i] = 1
    const prior = history[history.length - 2]
    const priorSquares = prior ? prior.squares.slice() : []

    utilities.sendMove(1, priorSquares, startSquares, playerSquares)

    // check for winner
    let winner = utilities.calculateWinner(playerSquares)
    if (winner) {
      // skip ai turn if player win
      return this.setState({
        history: this.state.history.concat({ squares: playerSquares }),
        stepNumber: this.state.history.length,
        winner: winner
      })
    }

    // take ai move
    utilities.getMove(playerSquares, 2)
      .then(aiSquares => {
        let winner = utilities.calculateWinner(aiSquares)
        let stepNumber = this.state.history.length + 1
        this.setState({
          history: this.state.history.concat([
            { squares: playerSquares },
            { squares: aiSquares }
          ]),
          stepNumber: stepNumber,
          winner: winner
        }, () => utilities.sendMove(2, startSquares, playerSquares, aiSquares))
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
