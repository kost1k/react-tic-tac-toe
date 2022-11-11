import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  return [null, []];
}

function getSquareIcon(symbol) {
  let icon;

  switch(symbol) {
    case 'X':
      icon = <svg viewBox="0 0 40 40">
        <line className="x-line" x1="10" x2="30" y1="10" y2="30" stroke="black" strokeLinecap="round" strokeWidth="2px"/>
        <line className="x-line" x1="30" x2="10" y1="10" y2="30" stroke="black" strokeLinecap="round" strokeWidth="2px"/>
      </svg>;
      break;
    case 'O':
      icon = <svg viewBox="0 0 40 40">
        <circle className="zero" cx="20" cy="20" r="10" transform="rotate(-135, 20, 20)" stroke="black" strokeLinecap="round" strokeWidth="2px" fill="none"/>
      </svg>;
      break;
    default:
      break;
  }

  return icon;
}

function Square(props) {
  return (
    <button
      className={props.className}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  render() {
    return (
      <div className="game-board">
        {Array(9).fill().map((e, i) => (
          <Square
            className={`square ${this.props.winSquares.includes(i) ? 'square--highlight' : ''}`}
            key={i}
            value={getSquareIcon(this.props.squares[i])}
            onClick={() => this.props.onClick(i)}
          />
        ))}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const [winner] = calculateWinner(squares);
    if (winner || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  restartGame() {
    this.setState({
      history: [{
        squares: Array(9).fill(null),
      }],
      stepNumber: 0,
      xIsNext: true,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const [winner, winnerSquares] = calculateWinner(current.squares);
    const moves = history.map((step, move) => {
      if (move > 0) {
        return (
          <li className="moves-list__item" key={move}>
            <button className="moves-list__btn" onClick={() => this.jumpTo(move)}>{move}</button>
          </li>
        );
      }
      return null;
    })

    const getEndStatus = () => {
      if (winner) {
        return <div className="game__status-text">Выиграл <span>{winner}</span></div>;
      } else if (this.state.stepNumber === 9) {
        return <div className="game__status-text">Ничья!</div>;
      }
      return null;
    };

    const endStatus = getEndStatus();

    const getStatus = () => {
      if (endStatus) {
        return <div className="game__status-text">Игра окночена</div>;
      } else {
        return <div className="game__status-text">Ходит: <span>{this.state.xIsNext ? 'X' : 'O'}</span></div>;
      }
    };

    const status = getStatus();

    return (
      <div className="game">
        <div className="game__panel">
          <div className="game__status">
            {status}
          </div>
          <div className="game__board">
            <Board squares={current.squares} winSquares={winnerSquares} onClick={(i) => this.handleClick(i)} />
            {endStatus ?
            <div className="game__end-overlay">
              <div className="game__status-text">{endStatus}</div>
              <div className="game__btn-row">
                <button className="restart-game" onClick={() => this.restartGame()}>Начать заново</button>
              </div>
            </div>
            : ""}
          </div>
          {moves.length > 1 ?
          <div className="game__log">
            <div className="game__log-title">Перейти к ходу:</div>
            <ul className="moves-list">{moves}</ul>
          </div>
          : ""}
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
