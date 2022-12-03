const container = document.getElementById("root")
const getInitBoard = () => [
  [-2, -3, -4, -5, -6, -4, -3, -2],
  [-1, -1, -1, -1, -1, -1, -1, -1],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [2, 3, 4, 5, 6, 4, 3, 2],
]

const testBoard = [
  [-2, -3, -4, 0, -6, -4, -3, -2],
  [-1, -1, -1, -1, -1, -1, -1, -1],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, -5, 0, 0],
  [0, 0, 0, 5, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [2, 3, 4, 0, 6, 4, 3, 2],
]

const X = 0,
  Y = 1,
  BOARD_SIZE = 8,
  WHITE = 1,
  BLACK = -1,
  FREE_CELL = 0,
  PAWN_B = -1,
  PAWN_W = 1,
  ROOK_B = -2,
  ROOK_W = 2,
  KNIGHT_B = -3,
  KNIGHT_W = 3,
  BISHOP_B = -4,
  BISHOP_W = 4,
  QUEEN_B = -5,
  QUEEN_W = 5,
  KING_B = -6,
  KING_W = 6

const PAWNS = [PAWN_B, PAWN_W]
const KNIGHTS = [KNIGHT_B, KNIGHT_W]
const KINGS = [KING_B, KING_W]
const LONG_MOVING_PIECES = [
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
    img: "./images/black/pawn.svg",
    stepDirection: 1,
  },
  [PAWN_W]: {
    img: "./images/white/pawn.svg",
    stepDirection: -1,
  },
  [ROOK_B]: {
    img: "./images/black/rook.svg",
    steps: rookSteps,
  },
  [ROOK_W]: {
    img: "./images/white/rook.svg",
    steps: rookSteps,
  },
  [KNIGHT_B]: {
    img: "./images/black/knight.svg",
  },
  [KNIGHT_W]: {
    img: "./images/white/knight.svg",
  },
  [BISHOP_B]: {
    img: "./images/black/bishop.svg",
    steps: bishopSteps,
  },
  [BISHOP_W]: {
    img: "./images/white/bishop.svg",
    steps: bishopSteps,
  },
  [QUEEN_B]: {
    img: "./images/black/queen.svg",
    steps: [...rookSteps, ...bishopSteps],
  },
  [QUEEN_W]: {
    img: "./images/white/queen.svg",
    steps: [...rookSteps, ...bishopSteps],
  },
  [KING_B]: {
    img: "./images/black/king.svg",
    steps: kingSteps,
  },
  [KING_W]: {
    img: "./images/white/king.svg",
    steps: kingSteps,
  },
}

const isLongMovingPiece = (piece) => LONG_MOVING_PIECES.includes(piece)
const isPawn = (piece) => PAWNS.includes(piece)
const isKnight = (piece) => KNIGHTS.includes(piece)
const isKing = (piece) => KINGS.includes(piece)

const getClone = (data) => JSON.parse(JSON.stringify(data))
const isFree = (value) => value === FREE_CELL
const isCoordsEqual = (coords1, coords2) =>
  coords1[X] === coords2[X] && coords1[Y] === coords2[Y]

const getImage = (cell) => {
  const img = document.createElement("img")
  img.src = PIECES[cell].img
  return img
}

const getPoint = (type) => {
  const point = document.createElement("span")
  point.classList.add(type === 1 ? "free" : "opponent")
  return point
}

const getNewMatrix = (size) =>
  Array(size)
    .fill()
    .map(() => Array(size).fill(0))

const newGame = (initialBoard = getInitBoard(), playerTurn = WHITE) => {
  let board = getClone(initialBoard)
  let points = getNewMatrix(8)
  let activePiece = [null, null]
  let turn = playerTurn

  const isFree = ([x, y]) => board[x][y] === FREE_CELL

  const getPiece = ([x, y]) => board[x][y]

  const getPlayer = (piece) => Math.sign(piece)

  const getOpponentPlayer = () => -1 * turn

  const isOpponent = (player) => player === getOpponentPlayer()

  const getPlayerFromCoords = (coords) => {
    if (isFree(coords)) return null
    return getPlayer(getPiece(coords))
  }

  const isInRange = (value) => value < BOARD_SIZE && value > -1

  const isValidCoords = ([x, y]) => isInRange(x) && isInRange(y)

  const addPoint = ([x, y], num) => (points[x][y] = num)

  const activateCell = (coords) => {
    if (isFree(coords)) return addPoint(coords, 1)
    addPoint(coords, 2)
  }

  const activateLine = ([x, y], [dx, dy]) => {
    const newCoords = [x + dx, y + dy]
    if (!isValidCoords(newCoords)) return

    const player = getPlayerFromCoords(newCoords)
    if (player === turn) return

    activateCell(newCoords)
    if (isOpponent(player)) return

    activateLine(newCoords, [dx, dy])
  }

  const activateLongMovingPiece = (piece, [x, y]) => {
    PIECES[piece].steps.forEach((step) => {
      activateLine([x, y], step)
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
      if (isValidCoords(newCoords) && getPlayerFromCoords(newCoords) !== turn)
        activateCell(newCoords)
    })
  }

  const activatePiece = ([x, y]) => {
    activePiece = [x, y]
    const piece = board[x][y]
    if (isLongMovingPiece(piece)) {
      activateLongMovingPiece(piece, [x, y])
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

  const changeTurn = () => {
    turn = getOpponentPlayer()
  }

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

const game = newGame(testBoard)

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
