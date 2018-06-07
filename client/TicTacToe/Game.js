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
      stepNumber: 0
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
    const current = history[history.length - 1]
    const playerSquares = current.squares.slice()

    if (playerSquares[i]) {
      return
    }

    if (utilities.calculateWinner(playerSquares)) {
      // const prior = history[history.length - 2]
      // const priorSquares = prior.squares.slice()
      // utilities.updateMove(priorSquares)
      return
    }

    playerSquares[i] = 1
    utilities.getMove(playerSquares)
      .then(aiSquares => {
        console.log('get move response:', aiSquares)
        this.setState({
          history: this.state.history.concat([
            { squares: playerSquares },
            { squares: aiSquares }
          ]),
          stepNumber: this.state.history.length + 1
        })
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
