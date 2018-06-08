import React, { Component } from 'react'
import './Square.css'

class Square extends Component {
  renderImg(url) {
    if (url) {
      return (
        <img
          src={ url }
          alt="car image"
          className="square-icon"
        />)
    }
    return null
  }

  render() {
    return(
      <button
        className='square'
        onClick={ this.props.onClick }>
          { this.renderImg(this.props.imgUrl) }
      </button>
    )
  }
}

export default Square
