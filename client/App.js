import React, { Component } from 'react'
import NavBar from './components/NavBar.js'
import Footer from './components/Footer.js'
import TicTacToe from './TicTacToe/Game.js'
import Chart from './components/Chart.js'
import 'font-awesome/css/font-awesome.min.css'
import './styles.css'
import './App.css'

const data = [
  { x: 1, y: 2 },
  { x: 2, y: 3 },
  { x: 3, y: 5 },
  { x: 4, y: 4 },
  { x: 5, y: 7 }
]

class App extends Component {
  render() {
    return(
      <div className="app">
        <NavBar />
        <TicTacToe />
        <Chart data={ data }/>
        <Footer />
      </div>
    )
  }
}

export default App
