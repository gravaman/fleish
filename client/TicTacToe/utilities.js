let utilities = {
  calculateWinner: function(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ]
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
        return squares[a]
      }
    }
    return null
  },
  squaresToKey: function(squares) {
    squares = squares.slice()
    return squares.map( square => !square ? 0 : square).join('')
  },
  keyToSquares: function(key) {
    return key.split('').map(move => Number(move) === 0 ? null : Number(move))
  },
  updateMove: function(squares) {
    let key = utilities.squaresToKey(squares)
    let url = `/move/${ key }`
    let data = JSON.stringify({ winner: 1 })
    let opts = {
      method: 'PUT',
      body: data
    }
    return fetch('/move', opts).then(res => {})
  },
  getMove: function(squares) {
    squares = squares.slice()
    let key = squares.map( square => !square ? 0 : square).join('')
    return fetch(`/move/${ key }`).then(res => {
      console.log('the response:', res)
      if (res.status !== 200) {
        console.error('error getting move:', res.status, res.statusText)
        return
      }
      return res.text()
    }).then(key => utilities.keyToSquares(key))
  }
}

export default utilities
