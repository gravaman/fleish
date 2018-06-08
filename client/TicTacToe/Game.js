import React, { Component } from 'react'
import Board from './Board.js'
import InfoRepo from './InfoRepo.js'
import utilities from './utilities'
import './Game.css'

class Game extends Component {
  constructor(props) {
    super(props)
    this.state = {
      history: [
        { squares: Array(9).fill(null) }
      ],
      stepNumber: 0,
      seriesStats: {
        wins: 0,
        losses: 0,
        draws: 0
      },
      winner: null
    }
  }

  get squares() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    return current.squares
  }

  updatedStats(winner) {
    let stats = Object.assign({}, this.state.seriesStats)
    console.log('current stats:', stats)
    let updated = Object.assign(stats, {
      wins: winner === 1 ? stats.wins + 1 : stats.wins,
      losses: winner === 2 ? stats.losses + 1 : stats.losses,
      draws: winner === 0 ? stats.draws + 1 : stats.draws
    })
    console.log('updated stats:', updated)
    return updated
  }

  handleReplay() {
    return this.setState({
      history: [
        { squares: Array(9).fill(null) }
      ],
      stepNumber: 0,
      winner: null
    })
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
    if (winner !== null) {
      // skip ai turn if player win
      return this.setState({
        history: this.state.history.concat({ squares: playerSquares }),
        stepNumber: this.state.history.length,
        seriesStats: this.updatedStats(winner),
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
          seriesStats: this.updatedStats(winner),
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
        <InfoRepo
          winner={ this.state.winner }
          onReplay={ () => this.handleReplay() }
          seriesStats={ this.state.seriesStats }
        />
      </div>
    )
  }
}

export default Game
