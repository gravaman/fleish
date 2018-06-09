import React, { Component } from 'react'
import NavBar from './components/NavBar.js'
import TicTacToe from './TicTacToe/Game.js'
import 'font-awesome/css/font-awesome.min.css'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import 'react-tabs/style/react-tabs.css'
import './styles.css'
import './App.css'

class App extends Component {
  render() {
    return(
      <div className="app">
        <NavBar />
        <Tabs>
          <TabList>
            <Tab>hello, world!</Tab>
          </TabList>
          <TabPanel>
            <TicTacToe />
          </TabPanel>
        </Tabs>
      </div>
    )
  }
}

export default App
