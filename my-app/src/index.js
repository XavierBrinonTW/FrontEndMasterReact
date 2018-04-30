import React from 'react'
import ReactDOM from 'react-dom'

const calculateWinner = squares => {
  let winner = false;
  [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ].forEach(([a, b, c]) => {
    if (!winner && squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      winner = squares[a]
    }
  })
  return winner
}

const Square = ({onClick, value}) => <button className='square' onClick={onClick} >
  {value}
</button>

class Board extends React.Component {
  renderSquare (i) {
    return <Square
      value={this.props.squares[i]}
      onClick={_ => this.props.onClick(i)}
    />
  }

  render () {
    return (
      <div>
        <div className='board-row'>
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className='board-row'>
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className='board-row'>
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    )
  }
}

class Game extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      'history': [
        { 'squares': Array(9).fill(null) }
      ],
      'xIsNext': true,
      'stepNumber': 0
    }
  }

  handleClick (i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const {squares: current} = history[history.length - 1]
    const squares = current.slice()

    if (calculateWinner(squares) || squares[i]) {
      return
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O'
    this.setState({
      'history': history.concat([{squares}]),
      'xIsNext': !this.state.xIsNext,
      'stepNumber': history.length
    })
  }

  jumpTo (step) {
    this.setState({
      'stepNumber': step,
      'xIsNext': (step % 2) === 0
    })
  }

  render () {
    const {history} = this.state
    const {squares} = history[this.state.stepNumber]

    const moves = history.map((step, move) => {
      const desc = move
        ? `Go to move#${move}`
        : 'Go to game start'
      return <li key={move} >
        <button onClick={_ => this.jumpTo(move)}>{desc}</button>
      </li>
    })

    const winner = calculateWinner(squares)
    let status = winner
      ? `Winner ${winner}`
      : `Next player: ${this.state.xIsNext ? 'X' : 'O'}`

    return (
      <div className='game'>
        <div className='game-board'>
          <Board
            squares={squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className='game-info'>
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    )
  }
}

ReactDOM.render(
  <Game />,
  document.getElementById('root')
)
