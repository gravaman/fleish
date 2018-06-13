import React, { Component } from 'react'
import './Footer.css'

class Footer extends Component {
  render() {
    return (
      <footer>
        <a href="mailto:fleish@doowop.co" className="email">fleish@doowop.co</a>
        <a href="https://github.com/gravaman" target="_blank" className="github">
          <img src="images/github-mark/PNG/GitHub-Mark-Light-32px.png" />
        </a>
      </footer>
    )
  }
}

export default Footer
