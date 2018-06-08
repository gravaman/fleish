import React, { Component } from 'react'
import NavBar from './components/NavBar.js'
import TicTacToe from './TicTacToe/Game.js'
import 'primereact/components/common/common.css'
import 'font-awesome/css/font-awesome.css'
import './styles.css'
import './App.css'

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
