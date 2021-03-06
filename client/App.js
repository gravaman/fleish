import React, { Component } from 'react'
import NavBar from './components/NavBar.js'
import Footer from './components/Footer.js'
import TicTacToe from './TicTacToe/Game.js'
import 'font-awesome/css/font-awesome.min.css'
import './styles.css'
import './App.css'

class App extends Component {
  render() {
    return(
      <div className="app">
        <NavBar />
        <TicTacToe />
        <Footer />
      </div>
    )
  }
}

export default App
