import React, { Component } from 'react'
import NavBar from './components/NavBar.js'
import TicTacToe from './TicTacToe/Game.js'
import './App.css'
import 'primereact/components/common/common.css'
import 'font-awesome/css/font-awesome.css'

class App extends Component {
  render() {
    return(
      <div className="App">
        <NavBar />
        <TicTacToe />
      </div>
    )
  }
}

export default App
