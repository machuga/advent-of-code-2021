const { parseInput, pipe, map, reduce, transpose } = require('../util');
const [filename = 0] = process.argv.slice(2);

const getInstructions = pipe([
  parseInput,
  map((line) => line.split('')),
]);

const sum = reduce((acc, e) => acc + parseInt(e, 10), 0);
const findMostCommonBit = (bitArray) => sum(bitArray) > bitArray.length / 2 ? 1 : 0;
const generateBitmask = (bitArray) => (2 ** bitArray.length) - 1

const part1 = () => {
  const calculate = pipe([
    getInstructions,
    transpose,
    map((arr) => findMostCommonBit(arr)),
    (arr) => [parseInt(arr.join(''), 2), generateBitmask(arr)],
    ([gamma, bitmask]) => gamma * (gamma ^ bitmask),
  ]);

  console.log(`Part 1: "${calculate(filename)}"`);
};

const part2 = () => {

  console.log(`Part 2: "${undefined}"`);
};


part1();
part2();
