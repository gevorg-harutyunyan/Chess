const container = document.getElementById("root")
const getInitBoard = () => [
  [3, 5, 7, 9, 11, 7, 5, 3],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [2, 2, 2, 2, 2, 2, 2, 2],
  [4, 6, 8, 10, 12, 8, 6, 4],
]
///
const testBoard = [
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 5, 0, 0],
  [0, 0, 0, 5, 0, 6, 0, 0],
  [0, 0, 0, 0, 0, 5, 0, 0],
  [0, 0, 0, 0, 6, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 6, 0, 0],
]

const X = 0,
  Y = 1,
  BOARD_SIZE = 8,
  WHITE = 0,
  BLACK = 1,
  FREE_CELL = 0,
  PAWN_B = 1,
  PAWN_W = 2,
  ROOK_B = 3,
  ROOK_W = 4,
  KNIGHT_B = 5,
  KNIGHT_W = 6,
  BISHOP_B = 7,
  BISHOP_W = 8,
  QUEEN_B = 9,
  QUEEN_W = 10,
  KING_B = 11,
  KING_W = 12

const PAWNS = [PAWN_B, PAWN_W]
const KNIGHTS = [KNIGHT_B, KNIGHT_W]
const KINGS = [KING_B, KING_W]
const LONG_MOVEING_PIECES = [
  ROOK_B,
  ROOK_W,
  BISHOP_B,
  BISHOP_W,
  QUEEN_B,
  QUEEN_W,
]

const bishopSteps = [
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
]

const rookSteps = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
]

const knightSteps = [
  [2, 1],
  [2, -1],
  [-2, 1],
  [-2, -1],
  [-1, 2],
  [1, 2],
  [-1, -2],
  [1, -2],
]

const kingSteps = [
  [1, -1],
  [1, 0],
  [1, 1],
  [0, -1],
  [0, 1],
  [-1, -1],
  [-1, 0],
  [-1, 1],
]

const PIECES = {
  [PAWN_B]: {
    img: "./images/pawn-black.svg",
    stepDirection: 1,
  },
  [PAWN_W]: {
    img: "./images/pawn-white.svg",
    stepDirection: -1,
  },
  [ROOK_B]: {
    img: "./images/rook-black.svg",
    steps: rookSteps,
  },
  [ROOK_W]: {
    img: "./images/rook-white.svg",
    steps: rookSteps,
  },
  [KNIGHT_B]: {
    img: "./images/knight-black.svg",
  },
  [KNIGHT_W]: {
    img: "./images/knight-white.svg",
  },
  [BISHOP_B]: {
    img: "./images/bishop-black.svg",
    steps: bishopSteps,
  },
  [BISHOP_W]: {
    img: "./images/bishop-white.svg",
    steps: bishopSteps,
  },
  [QUEEN_B]: {
    img: "./images/queen-black.svg",
    steps: [...rookSteps, ...bishopSteps],
  },
  [QUEEN_W]: {
    img: "./images/queen-white.svg",
    steps: [...rookSteps, ...bishopSteps],
  },
  [KING_B]: {
    img: "./images/king-black.svg",
    steps: kingSteps,
  },
  [KING_W]: {
    img: "./images/king-white.svg",
    steps: kingSteps,
  },
}

const isLongMoveingPiece = (piece) => LONG_MOVEING_PIECES.includes(piece)
const isPawn = (piece) => PAWNS.includes(piece)
const isKnight = (piece) => KNIGHTS.includes(piece)
const isKing = (piece) => KINGS.includes(piece)

const getClone = (data) => JSON.parse(JSON.stringify(data))
const isFree = (value) => value === FREE_CELL
const isCoordesEqual = (coords1, coords2) =>
  coords1[X] === coords2[X] && coords1[Y] === coords2[Y]

const getImage = (cell) => {
  const img = document.createElement("img")
  img.src = PIECES[cell].img
  return img
}

const getPoint = (type) => {
  const point = document.createElement("span")
  point.classList.add(type === 1 ? "free" : "oponent")
  return point
}

const getNewMatrix = (size) =>
  Array(size)
    .fill()
    .map(() => Array(size).fill(0))
    

/////////////////////////////////////////////////////////////////

const newGame = (initialBoard = getInitBoard(), playerTurn = WHITE) => {
  let board = getClone(initialBoard)
  let points = getNewMatrix(8)
  let activePiece = [null, null]
  let turn = playerTurn

  const isFree = ([x, y]) => board[x][y] === FREE_CELL

  const getPiece = ([x, y]) => board[x][y]

  const getPlayer = (piece) => piece % 2

  const getOpponentPlayer = () => 1 - turn

  const isOpponent = (player) => player === getOpponentPlayer()

  const getPlayerFromCoords = (coords) => {
    if (isFree(coords)) return null
    return getPlayer(getPiece(coords))
  }

  const isInRange = (value) => value < BOARD_SIZE && value > -1

  const isValideCoords = ([x, y]) => isInRange(x) && isInRange(y)

  const addPoint = ([x, y], num) => (points[x][y] = num)

  const activateCell = (coords) => {
    if (isFree(coords)) return addPoint(coords, 1)
    addPoint(coords, 2)
  }

  const activateԼine = ([x, y], [dx, dy]) => {
    const newCoords = [x + dx, y + dy]
    if (!isValideCoords(newCoords)) return
    const player = getPlayerFromCoords(newCoords)
    if (player === turn) return
    if (isOpponent(player)) return activateCell(newCoords)
    activateCell(newCoords)
    activateԼine(newCoords, [dx, dy])
  }

  const activateLongMoveingPiece = (piece, [x, y]) => {
    PIECES[piece].steps.forEach((step) => {
      activateԼine([x, y], step)
    })
  }

  const isPawnInInitCoords = (coords) => {
    const player = getPlayerFromCoords(coords)
    if (player === WHITE) return coords[X] === 6
    if (player === BLACK) return coords[X] === 1
  }

  const activatePawnAttackCoords = (piece, [x, y]) => {
    const direction = PIECES[piece].stepDirection
    const leftCoords = [x + 1 * direction, y - 1]
    const rightCoords = [x + 1 * direction, y + 1]
    if (isOpponent(getPlayerFromCoords(leftCoords))) {
      activateCell(leftCoords)
    }
    if (isOpponent(getPlayerFromCoords(rightCoords))) {
      activateCell(rightCoords)
    }
  }

  const activatePawnStepsCoords = (piece, [x, y]) => {
    const direction = PIECES[piece].stepDirection
    const stepOneCoords = [x + 1 * direction, y]
    if (!isFree(stepOneCoords)) return
    activateCell(stepOneCoords)
    const stepTwoCoords = [x + 2 * direction, y]
    if (isPawnInInitCoords([x, y]) && isFree(stepTwoCoords))
      activateCell(stepTwoCoords)
  }

  const activatePawn = (coords) => {
    const piece = getPiece(coords)
    activatePawnStepsCoords(piece, coords)
    activatePawnAttackCoords(piece, coords)
  }

  const activateKnight = ([x, y]) => {
    knightSteps.forEach(([dx, dy]) => {
      const newCoords = [x + dx, y + dy]
      if (isValideCoords(newCoords) && getPlayerFromCoords(newCoords) !== turn)
        activateCell(newCoords)
    })
  }

  const activatePiece = ([x, y]) => {
    activePiece = [x, y]
    const piece = board[x][y]
    if (isLongMoveingPiece(piece)) {
      activateLongMoveingPiece(piece, [x, y])
    } else if (isPawn(piece)) {
      activatePawn([x, y])
    } else if (isKnight(piece)) {
      activateKnight([x, y])
    } else if (isKing(piece)) {
      console.log("king")
    }
  }

  const deactivate = () => {
    activePiece = [null, null]
    points = getNewMatrix(8)
  }

  const makeMove = ([initX, initY], [newX, newY]) => {
    board[newX][[newY]] = board[initX][[initY]]
    board[initX][[initY]] = 0
  }

  const isCellActive = ([x, y]) => points[x][y] > 0

  const changeTurn = () => (turn = 1 - turn)

  const isPieceActive = ([x, y]) => activePiece[X] === x && activePiece[Y] === y

  const event = (coords) => {
    if (isCellActive(coords)) {
      makeMove(activePiece, coords)
      deactivate()
      changeTurn()
    } else if (getPlayerFromCoords(coords) !== turn || isPieceActive(coords)) {
      deactivate()
    } else {
      deactivate()
      activatePiece(coords)
    }
    return { board, points }
  }

  const start = () => {
    return { board, points }
  }

  return {
    start,
    event,
  }
}

const game = newGame()

const click = (coords) => () => {
  const { board, points } = game.event(coords)
  renderMatrix(container, board, points)
}

const renderMatrix = (container, board, points) => {
  // console.log("Rendered")
  container.innerHTML = ""
  const table = document.createElement("table")
  board.forEach((row, i) => {
    const tr = document.createElement("tr")
    row.forEach((cell, j) => {
      const td = document.createElement("td")
      td.classList.add((i + j) % 2 === 0 ? "white-cell" : "black-cell")
      if (!isFree(cell)) td.appendChild(getImage(cell))
      if (points[i][j] !== 0) td.appendChild(getPoint(points[i][j]))
      td.addEventListener("click", click([i, j]))
      tr.appendChild(td)
    })
    table.appendChild(tr)
  })
  container.appendChild(table)
}

const { board, points } = game.start()

renderMatrix(container, board, points)
