import React, { Component } from 'react'
import './Square.css'

class Square extends Component {
  renderText() {
    if (this.props.value === 1) {
      return 'O'
    }
    if (this.props.value === 2) {
      return 'X'
    }
    return
  }

  render() {
    return(
      <button
        className="square"
        onClick={ this.props.onClick }>
          { this.renderText() }
      </button>
    )
  }
}

export default Square
