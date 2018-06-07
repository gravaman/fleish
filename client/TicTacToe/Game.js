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
    const prior = history[history.length - 1]
    const playerSquares = prior.squares.slice()

    // do nothing if square already played or game is over
    if (playerSquares[i] || this.state.winner) {
      return
    }

    // take player move
    playerSquares[i] = 1
    const priorSquares = prior.squares.slice()
    utilities.sendMove(priorSquares, playerSquares, 1)

    // check for winner
    if (utilities.calculateWinner(playerSquares)) {
      // skip ai turn if player win
      let winner = utilities.calculateWinner(playerSquares)
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
        }, () => utilities.sendMove(playerSquares, aiSquares, 2))
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
