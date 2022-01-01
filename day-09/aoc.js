const { parseInput, toInt, tap, split, join, pipe, map, reduce, sum, flatMap, filter, sort, find } = require('../util');
const [filename = 0] = process.argv.slice(2);

const getInput =
  pipe([
    parseInput,
    map(pipe([
      split(''),
      map(toInt)
    ])),
  ]);

const directions = [
  [0, 1], // North
  [0, -1], // South
  [1, 0], // East
  [-1, 0], // West
];

const isLowestNeighbor = (matrix, row, col) => {
  const neighbors = directions.map(([x, y]) => matrix[row + y]?.[col + x]).filter(dir => dir !== undefined);

  return neighbors.find(neighbor => neighbor <= matrix[row][col]) === undefined;
};

const findLowestPoints = (rows) =>
  rows.reduce((rowsAcc, row, rowIndex) =>
    rowsAcc.concat(row.reduce((colsAcc, num, colIndex) => {
      if (isLowestNeighbor(rows, rowIndex, colIndex)) {
        colsAcc.push(num);
      }

      return colsAcc;
    }, [])), []);

const part1 = () => {
  const calculate = pipe([
    getInput,
    findLowestPoints,
    tap("Lowest points"),
    map(position => position + 1),
    sum,
  ]);

  const result = calculate(filename);

  console.log(`Part 1: "${result}"`);
};

const part2 = () => {
  const calculate = pipe([
    getInput,
  ]);

  const result = calculate(filename);

  //console.log(`Part 2: "${result}"`);
};

part1();
part2();
