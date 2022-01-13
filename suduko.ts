type Puzzle = number[][];

const table: Puzzle = [
  [-1, -1, -1, 2, 6, -1, 7, -1, 1],
  [6, 8, -1, -1, 7, -1, -1, 9, -1],
  [1, 9, -1, -1, -1, 4, 5, -1, -1],
  [8, 2, -1, 1, -1, -1, -1, 4, -1],
  [-1, -1, 4, 6, -1, 2, 9, -1, -1],
  [-1, 5, -1, -1, -1, 3, -1, 2, 8],
  [-1, -1, 9, 3, -1, -1, -1, 7, 4],
  [-1, 4, -1, -1, 5, -1, -1, 3, 6],
  [7, -1, 3, -1, 1, 8, -1, -1, -1],
];

const table2: Puzzle = [
  [-1, 2, -1, -1, -1, -1, -1, -1, -1],
  [-1, -1, -1, 6, -1, -1, -1, -1, 3],
  [-1, 7, 4, -1, 8, -1, -1, -1, -1],
  [-1, -1, -1, -1, -1, 3, -1, -1, 2],
  [-1, 8, -1, -1, 4, -1, -1, 1, -1],
  [6, -1, -1, 5, -1, -1, -1, -1, -1],
  [-1, -1, -1, -1, 1, -1, 7, 8, -1],
  [5, -1, -1, -1, -1, 9, -1, -1, -1],
  [-1, -1, -1, -1, -1, -1, -1, 4, -1],
];

const gridShape = 3;

const withGrid = (grid: Puzzle): {solved: boolean, valid: boolean, grid: Puzzle} => {
  const valid = isGridValid(grid) && areCellsValid(grid, gridShape);

  if (!valid) {
    return { valid, solved: false, grid };
  }

  const nextIndex = grid.reduce(
    (index, row, rowIndex) => {
      if (index[1] != -1) {
        return index;
      }
      return [rowIndex, row.indexOf(-1)];
    },
    [-1, -1]
  );

  if (nextIndex[1] == -1) {
    return { solved: true, valid: true, grid };
  }

  const row = grid[nextIndex[0]];
  const column = grid.reduce((column, row) => {
    column.push(row[nextIndex[1]]);
    return column;
  }, []);

  const possibleMoves = (() => {
    const possible = [];
    const usedNumbers = [...row, ...column];
    for (let x = 1; x <= gridShape * gridShape; x++) {
      if (!usedNumbers.includes(x)) {
        possible.push(x);
      }
    }
    return possible;
  })();

  const applyMove = (row: number, column: number, value: number): Puzzle => {
    const newGrid: Puzzle = [];
    for (let y = 0; y < grid.length; y++) {
      newGrid.push([]);
      for (let x = 0; x < grid.length; x++) {
        newGrid[y].push(y == row && x == column ? value : grid[y][x]);
      }
    }
    return newGrid;
  };

  for (let x = 0; x < possibleMoves.length; x++) {
    const [row, column] = nextIndex;
    const newGrid = applyMove(row, column, possibleMoves[x]);
    const { solved = false, ...rest } = withGrid(newGrid);
    if (solved) {
      return {solved, ...rest};
    }
  }

  return { valid: true, solved: false, grid };
};

const makeMove = (grid: Puzzle) => {};

const isGridValid = (grid: Puzzle) => {
  const columnNumbers: Record<number, Record<number, boolean>> = {};
  for (let y = 0; y < grid.length; y++) {
    // Detect same number in row
    const numbersFound: Record<number, boolean> = {};
    for (let x = 0; x < grid.length; x++) {
      const number = grid[y][x];
      if (number != -1) {
        if (!numbersFound[number]) {
          numbersFound[number] = true;
        } else {
          return false;
        }
      }
    }
    columnNumbers[y] = numbersFound;
  }
  return true;
};

const areCellsValid = (grid: Puzzle, cellSize: number) => {
  for(let y = 0; y <= grid.length - cellSize; y += cellSize) {
    for(let x = 0; x <= grid.length - cellSize; x += cellSize) {
        if(!isCellValid(grid, cellSize, x, y)) {
          return false;
        }
    }
  }
  return true;
}

const isCellValid = (grid: Puzzle, cellSize: number = 3, cellColumn = 0, cellRow = 0) => {
  const numbersFound: Record<number, boolean> = {};
  for (let y = cellRow; y < cellRow + cellSize; y++) {
    // Detect same number in row
    for (let x = cellColumn; x < cellColumn + cellSize; x++) {
      const number = grid[y][x];
      if (number != -1) {
        if (!numbersFound[number]) {
          numbersFound[number] = true;
        } else {
          return false;
        }
      }
    }
  }
  return true;
};

const gridDef = withGrid(table2);

console.log(gridDef?.grid);
