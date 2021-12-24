const { parseInput, toInt, split, pipe, map, reduce, flatMap, filter } = require('../util');
const [filename = 0] = process.argv.slice(2);

// Simple digits => 1, 4, 7, 8
const simpleCounts = [2, 4, 3, 7]

const parseSignals = pipe([
  map(pipe([
    split('|'),
    map((segment) => segment.trim().split(' '))
  ]))
]);

const part1 = () => {
  const calculate = pipe([
    parseInput,
    parseSignals,
    flatMap(([_, outputValues]) => outputValues),
    filter((value) => simpleCounts.includes(value.length)),
    (entries) => entries.length,
  ]);

  const result = calculate(filename);

  console.log(`Part 1: "${result}"`);
};

const part2 = () => {
  const calculate = pipe([
    parseInput,
    split('|'),
  ]);

  const result = calculate(filename);

  console.log(`Part 2: "${result}"`);
};

part1();
//part2();
