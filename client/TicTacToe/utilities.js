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

    // check for draw
    for (let i = 0; i < lines.length; i++) {
      if (!squares[i]) {
        return null
      }
    }
    return 0
  },
  squaresToKey: function(squares) {
    squares = squares.slice()
    return squares.map( square => !square ? 0 : square).join('')
  },
  keyToSquares: function(key) {
    return key.split('').map(move => Number(move) === 0 ? null : Number(move))
  },
  sendMove: function(player, priorSquares, startSquares, endSquares) {
    let priorKey = utilities.squaresToKey(priorSquares)
    let startKey = startSquares ? utilities.squaresToKey(startSquares) : null
    let endKey = utilities.squaresToKey(endSquares)
    let url = '/move'
    let data = JSON.stringify({ player, priorKey, startKey, endKey })
    let opts = {
      method: 'POST',
      body: data,
      headers: { 'Content-Type': 'application/json' }
    }
    return fetch(url, opts).then(res => console.log('send move status:', res.status))
  },
  getMove: function(squares, player) {
    squares = squares.slice()
    let key = squares.map( square => !square ? 0 : square).join('')
    return fetch(`/move/${ player }/${ key }`).then(res => {
      if (res.status !== 200) {
        return console.error('error getting move:', res.status)
      }
      return res.text()
    })
    .then(key => utilities.keyToSquares(key))
  }
}

export default utilities
