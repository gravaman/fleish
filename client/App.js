import React, { Component } from 'react'
import TicTacToe from './TicTacToe/Game.js'
import './App.less'

class App extends Component {
  render() {
    return(
      <div className="App">
        <h1>Hello World!</h1>
        <TicTacToe />
      </div>
    )
  }
}

export default App
