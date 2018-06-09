import React, { Component } from 'react'
import './NavBar.css'

class NavBar extends Component {
  render() {
    return(
      <header className='nav'>
        <h1 className='header'>
          <span className='logo-base'>doowo</span>
          <span className='logo-eyes'>{':'}</span>
          <span className='logo-end'>P</span>
        </h1>
      </header>
    )
  }
}

export default NavBar
