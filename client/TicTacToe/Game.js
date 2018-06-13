import React, { Component } from 'react'
import Board from './Board.js'
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
      winner: null
    }
  }

  get squares() {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    return current.squares
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
    const githubStr = 'github.com/gravaman/fleish'
    const githubLink = (<a href="https://github.com/gravaman/fleish">{ githubStr }</a>)
    const aboutText1 = `Hello, world! Welcome to the playground. This is the first of hopefully many mini-apps to come as I explore the world of ML.
      Tic-tac-toe was my first experience converting an algorithm into an executable program. The AI 'learns' which moves are optimal
      through experience instead of relying on pre-programmed moves for every board layout. That's all to say that if the AI opponent is too easy check
      back later!`
    const aboutText2 = `As I progress in my studies I intend to post updated games here as a means of practicing implementation. Please feel free to
      check out the codebase at `
    const closingText = '.'

    return(
      <div className="game">
        <div className="game-board">
          <Board
            squares={ this.squares }
            winner={ this.state.winner }
            onClick={ i => this.handleClick(i) }
            onReplay={ () => this.handleReplay() }
          />
        </div>
        <div className="game-info">
          <h2 className="about-title">about</h2>
          <p className='about-text'>
            { aboutText1 }
          </p>
          <p className='about-text'>
            { aboutText2 }{ githubLink }{ closingText }
          </p>
        </div>
      </div>
    )
  }
}

export default Game
