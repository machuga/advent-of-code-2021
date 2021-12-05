const { parseRawInput, pipe, map, reduce, transpose } = require('../util');
const [filename = 0] = process.argv.slice(2);

const sum = reduce((acc, e) => acc + parseInt(e, 10), 0);
const findMostCommonBit = (bitArray) => sum(bitArray) > bitArray.length / 2 ? 1 : 0;
const generateBitmask = (bitArray) => (2 ** bitArray.length) - 1
const getBit = (value, position) => (value >> position) & 1;

const toInt = (num) => parseInt(num, 10);

const createBoard = (arr) => ({ matches: new Set(), numbers: arr.map(toInt) });
const parseRawBoard = (rawBoard) =>
  createBoard(rawBoard.trim().split(/\s+/).map(toInt));

const winVectors = (function() {
  const base = [0, 1, 2, 3, 4];
  const horizontals = base.map((num) => base.map(x => x + (5 * num)));
  const verticals = base.map((num) => base.map(x => (x * 5) + num));
  const diagonalTopLeft = base.map(num => 6 * num);
  const diagonalTopRight = base.map(num => 4 + (4 * num));

  return [...verticals, ...horizontals]; //, diagonalTopLeft, diagonalTopRight];
}());

// Need to optimize
const checkForWin = (board) => {
  if (board.matches.size < 5) {
    return false;
  }

  const vector = winVectors.find(vector => vector.every(el => board.matches.has(el)));

  return vector;
};


const markBoardWith = (number) => (board) => {
  if (board.wonWith) {
    return board;
  }

  const match = board.numbers.findIndex(el => el === number);

  if (match !== -1) {
    board.matches.add(match);
  }

  return board;
};

const markBoardWinWith = (number) => (board) => {
  if (board.wonWith) {
    return board;
  }

  const win = checkForWin(board);

  if (win) {
    board.wonWith = {
      vector: win,
      number,
    };
  }

  return board;
};




const part1 = () => {
  const input = pipe([
    parseRawInput,
    (input) => input.split('\n\n'),
    ([draw, ...rawBoards]) => {
      const numbers = draw.split(',').map(toInt);
      const boards = pipe([
        map(parseRawBoard),
      ])(rawBoards);

      return [numbers, boards];
    },
  ])(filename);

  const calculate = pipe([
    ([numbers, boards]) => {
      for (let key in numbers) {
        const num = numbers[key];
        const match = boards.map(markBoardWith(num)).find(checkForWin);

        if (match) {
          return [match, num, numbers];
        }
      }
    },
    ([board, num, draw]) => {
      const summed = board
        .numbers
        .filter((_, index) => !board.matches.has(index))
        .reduce((acc, e) => acc + e, 0);

      return summed * num;
    }
  ]);

  const result = calculate(input);

  console.log(`Part 1: "${result}"`);
};

const part2 = () => {
  const input = pipe([
    parseRawInput,
    (input) => input.split('\n\n'),
    ([draw, ...rawBoards]) => {
      const numbers = draw.split(',').map(toInt);
      const boards = pipe([
        map(parseRawBoard),
      ])(rawBoards);

      return [numbers, boards];
    },
  ])(filename);

  const calculate = pipe([
    ([numbers, boards]) => {
      const winners = new Set();

      for (let key in numbers) {
        const num = numbers[key];
        const boardIndex =
          boards
            .map(markBoardWith(num))
            .map(markBoardWinWith(num))
            .findIndex((board) => board.wonWith?.number === num);

        if (boardIndex !== -1) {
          winners.add(boardIndex);
        }

        // Last found
        if (winners.size === boards.length) {
          return [
            boards[boardIndex],
            boards[boardIndex].wonWith.number,
            numbers
          ];
        }
      }

      const winnersArr = [...winners];
      const lastWinner = boards[winnersArr[winnersArr.length - 1]];
      return [
        lastWinner,
        lastWinner.wonWith.number,
        numbers
      ];
      throw new Error('Did not find winner');
    },
    ([board, num, draw]) => {
      const summed = board
        .numbers
        .filter((_, index) => !board.matches.has(index))
        .reduce((acc, e) => acc + e, 0);

      return summed * num;
    }
  ]);

  const result = calculate(input);

  console.log(`Part 2: "${result}"`);
};


part1();
part2();
