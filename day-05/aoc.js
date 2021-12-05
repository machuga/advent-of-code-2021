const { parseInput, toInt, split, pipe, map, reduce, transpose } = require('../util');
const [filename = 0] = process.argv.slice(2);

const lineToCoords = 
  pipe([
    split(' -> '),
    map(pipe([
      split(','),
      map(toInt),
    ])),
  ]);

const part1 = () => {
  const calculate = pipe([
    parseInput,
    map(lineToCoords),
    x => x
  ]);

  const result = calculate(filename);
  console.log(result);

  console.log(`Part 1: "${result}"`);
};

const part2 = () => {
  const input = pipe([
    parseInput,
  ])(filename);

  const calculate = pipe([
    x => x
  ]);

  const result = calculate(input);

  console.log(`Part 2: "${result}"`);
};


part1();
part2();
