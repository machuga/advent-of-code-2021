const { parseInput, pipe, map, reduce } = require('../util');
const [filename = 0] = process.argv.slice(2);
const directionTable = {
  'forward': ['h', (value) => value],
  'down': ['d', (value) => value],
  'up': ['d', (value) => -value],
};

const calculateDirection = ([direction, value]) => {
  const [dir, fn] = directionTable[direction];

  return [dir, fn(parseInt(value, 10))];
};

const getInstructions = pipe([
  parseInput,
  map((line) => line.split(' ')),
  map(calculateDirection),
]);

const calculate = pipe([
  getInstructions,
  reduce((acc, [direction, amount]) => {
    acc[direction] += amount;

    return acc;
  }, { h: 0, d: 0 }),
  ({ h, d }) => h * d,
]);


const part1 = () => {
  console.log(`Part 1: Total is "${calculate(filename)}"`);
};

const part2 = () => {
};


part1();
part2();
