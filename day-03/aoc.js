const { parseInput, pipe, map, reduce, transpose } = require('../util');
const [filename = 0] = process.argv.slice(2);

const sum = reduce((acc, e) => acc + parseInt(e, 10), 0);
const findMostCommonBit = (bitArray) => sum(bitArray) > bitArray.length / 2 ? 1 : 0;
const generateBitmask = (bitArray) => (2 ** bitArray.length) - 1
const getBit = (value, position) => (value >> position) & 1;

const part1 = () => {
  const calculate = pipe([
    parseInput,
    map((line) => line.split('')),
    transpose,
    map((arr) => findMostCommonBit(arr)),
    (arr) => [parseInt(arr.join(''), 2), generateBitmask(arr)],
    ([gamma, bitmask]) => gamma * (gamma ^ bitmask),
  ]);

  console.log(`Part 1: "${calculate(filename)}"`);
};

const chooseList = ({ on, off }, favor) => {
  if (favor === 1) {
    return on.length >= off.length ? on : off;
  }

  return on.length >= off.length ? off : on;
};

const findTheThing = (list, position, favor = 1) => {
  if (list.length === 1) {
    return list[0];
  }

  const results = list.reduce((acc, num) => {
    const result = getBit(num, position) === 0 ? 'off' : 'on';
    acc[result].push(num);

    return acc;
  }, { on: [], off: [] });

  return findTheThing(chooseList(results, favor), position - 1, favor);
}

// Find life support rating -> O2 Generator Rating * CO2 Scrubber Rating
// Going to stick with bit manipulation

const part2 = () => {
  const instructions = parseInput(filename);
  const bitLength = instructions[0].length - 1;

  const calculate = pipe([
    map((x) => parseInt(x, 2)),
    (x) => {
      const o2 = findTheThing(x, bitLength, 1);
      const co2 = findTheThing(x, bitLength, 0);

      return o2 * co2;
    }
  ]);

  console.log(`Part 2: "${calculate(instructions)}"`);
};


part1();
part2();
