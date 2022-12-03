type Player = 1 | -1

type Piece = 0 | 1 | -1 | 2 | -2 | 3 | -3 | 4 | -4 | 5 | -5 | 6 | -6
type Point = 0 | 1 | 2

type Board = Piece[][]
type Points = Point[][]

type GameInfo = {
  board: Board
  points: Points
}

type Coords = [number, number]

type ActivePiece = {
  isActive: boolean
  coords: Coords
}

const getInitBoard = (): Board => [
  [-2, -3, -4, -5, -6, -4, -3, -2],
  [-1, -1, -1, -1, -1, -1, -1, -1],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1],
  [2, 3, 4, 5, 6, 4, 3, 2],
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

const bishopSteps: Coords[] = [
  [1, 1],
  [1, -1],
  [-1, 1],
  [-1, -1],
]

const rookSteps: Coords[] = [
  [0, 1],
  [0, -1],
  [1, 0],
  [-1, 0],
]

const knightSteps: Coords[] = [
  [2, 1],
  [2, -1],
  [-2, 1],
  [-2, -1],
  [-1, 2],
  [1, 2],
  [-1, -2],
  [1, -2],
]

const kingSteps: Coords[] = [
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

const isLongMovingPiece = (piece: Piece): boolean =>
  LONG_MOVING_PIECES.includes(piece)
const isPawn = (piece: Piece): boolean => PAWNS.includes(piece)
const isKnight = (piece: Piece): boolean => KNIGHTS.includes(piece)
const isKing = (piece: Piece): boolean => KINGS.includes(piece)

const getClone = <T>(data: T): T => JSON.parse(JSON.stringify(data))
const isFree = (value: Piece): boolean => value === FREE_CELL

const getInitPoints = (size: number): Points =>
  Array(size)
    .fill(null)
    .map(() => Array(size).fill(0))

const newGame = (initialBoard = getInitBoard(), playerTurn: Player = WHITE) => {
  let board: Board = getClone(initialBoard)
  let points: Points = getInitPoints(8)
  let turn: Player = playerTurn
  let activePiece: ActivePiece = {
    isActive: false,
    coords: [0, 0],
  }

  const getPiece = ([x, y]: Coords): Piece => board[x][y]

  const isCoordsFree = (coords: Coords): boolean => isFree(getPiece(coords))

  const getPlayer = (piece: Piece): Player => Math.sign(piece) as Player

  const getOpponentPlayer = (): Player => (-1 * turn) as Player

  const isOpponent = (player: Player): boolean => player === getOpponentPlayer()

  const getPlayerFromCoords = (coords: Coords): Player | null => {
    if (isCoordsFree(coords)) return null
    return getPlayer(getPiece(coords))
  }

  const isInBoard = (value: number): boolean => value < BOARD_SIZE && value > -1

  const isValidCoords = ([x, y]: Coords): boolean =>
    isInBoard(x) && isInBoard(y)

  const addPoint = ([x, y]: Coords, point: Point): void => {
    points[x][y] = point
  }

  const activateCell = (coords: Coords): void => {
    if (isCoordsFree(coords)) return addPoint(coords, 1)
    addPoint(coords, 2)
  }

  const activateLine = ([x, y]: Coords, [dx, dy]: Coords): void => {
    const newCoords: Coords = [x + dx, y + dy]
    if (!isValidCoords(newCoords)) return

    const player = getPlayerFromCoords(newCoords)
    if (!player || player === turn) return

    activateCell(newCoords)
    if (isOpponent(player)) return

    activateLine(newCoords, [dx, dy])
  }

  const activateLongMovingPiece = (piece: Piece, coords: Coords): void => {
    PIECES[piece].steps.forEach((step: Coords) => {
      activateLine(coords, step)
    })
  }

  const isPawnInInitCoords = (coords: Coords): boolean => {
    const player = getPlayerFromCoords(coords)
    if (player === WHITE) return coords[X] === 6
    if (player === BLACK) return coords[X] === 1
    return false
  }

  const activatePawnAttackCoords = (piece: Piece, [x, y]: Coords): void => {
    const direction: number = PIECES[piece].stepDirection
    const leftCoords: Coords = [x + 1 * direction, y - 1]
    const rightCoords: Coords = [x + 1 * direction, y + 1]
    if (isOpponent(getPlayerFromCoords(leftCoords) as Player)) {
      activateCell(leftCoords)
    }
    if (isOpponent(getPlayerFromCoords(rightCoords) as Player)) {
      activateCell(rightCoords)
    }
  }

  const activatePawnStepsCoords = (piece: Piece, [x, y]: Coords): void => {
    const direction = PIECES[piece].stepDirection
    const stepOneCoords: Coords = [x + 1 * direction, y]
    if (!isCoordsFree(stepOneCoords)) return
    activateCell(stepOneCoords)
    const stepTwoCoords: Coords = [x + 2 * direction, y]
    if (isPawnInInitCoords([x, y]) && isCoordsFree(stepTwoCoords))
      activateCell(stepTwoCoords)
  }

  const activatePawn = (coords: Coords): void => {
    const piece = getPiece(coords)
    activatePawnStepsCoords(piece, coords)
    activatePawnAttackCoords(piece, coords)
  }

  const activateKnight = ([x, y]: Coords): void => {
    knightSteps.forEach(([dx, dy]) => {
      const newCoords: Coords = [x + dx, y + dy]
      if (isValidCoords(newCoords) && getPlayerFromCoords(newCoords) !== turn)
        activateCell(newCoords)
    })
  }

  const activatePiece = (coords: Coords): void => {
    activePiece.isActive = true
    activePiece.coords = coords
    const piece = getPiece(coords)
    if (isLongMovingPiece(piece)) {
      activateLongMovingPiece(piece, coords)
    } else if (isPawn(piece)) {
      activatePawn(coords)
    } else if (isKnight(piece)) {
      activateKnight(coords)
    } else if (isKing(piece)) {
      console.log("king")
    }
  }

  const deactivate = (): void => {
    activePiece.isActive = false
    points = getNewMatrix(8)
  }

  const makeMove = ([initX, initY]: Coords, [newX, newY]: Coords): void => {
    board[newX][newY] = board[initX][initY]
    board[initX][initY] = 0
  }

  const isCellActive = ([x, y]: Coords): boolean => points[x][y] > 0

  const changeTurn = (): void => {
    turn = getOpponentPlayer()
  }

  const isPieceActive = ([x, y]: Coords): boolean =>
    activePiece.isActive &&
    activePiece.coords[X] === x &&
    activePiece.coords[Y] === y

  const event = (coords: Coords): GameInfo => {
    if (isCellActive(coords)) {
      makeMove(activePiece.coords, coords)
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

  const start = (): GameInfo => {
    return { board, points }
  }

  return {
    start,
    event,
  }
}

type OnClick = (coords: Coords) => () => void

const getImage = (piece: Piece): HTMLElement => {
  const img = document.createElement("img")
  img.src = PIECES[piece].img
  return img
}

const getPoint = (type: Point): HTMLElement => {
  const point = document.createElement("span")
  point.classList.add(type === 1 ? "free" : "opponent")
  return point
}

const renderGame = (
  container: HTMLElement,
  game: GameInfo,
  onClick: OnClick
): void => {
  container.innerHTML = ""
  const table = document.createElement("table")
  game.board.forEach((row, i) => {
    const tr = document.createElement("tr")
    row.forEach((cell, j) => {
      const td = document.createElement("td")
      td.classList.add((i + j) % 2 === 0 ? "white-cell" : "black-cell")
      if (!isFree(cell)) td.appendChild(getImage(cell))
      const pointNumber = game.points[i][j]
      if (pointNumber !== 0) td.appendChild(getPoint(pointNumber))
      td.addEventListener("click", onClick([i, j]))
      tr.appendChild(td)
    })
    table.appendChild(tr)
  })
  container.appendChild(table)
}

const game = newGame()
const container = document.getElementById("root")

const click: OnClick = (coords) => () => {
  renderGame(container as HTMLElement, game.event(coords), click)
}

renderGame(container as HTMLElement, game.start(), click)
