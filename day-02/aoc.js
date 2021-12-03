const { parseInput, pipe, map, reduce } = require('../util');
const [filename = 0] = process.argv.slice(2);

const getInstructions = pipe([
  parseInput,
  map((line) => line.split(' ')),
  map(([direction, amount]) => [direction, parseInt(amount, 10)]),
]);

const part1 = () => {
  const directionTable = {
    'forward': ['h', (value) => value],
    'down': ['d', (value) => value],
    'up': ['d', (value) => -value],
  };

  const calculateDirection = ([direction, value]) => {
    const [dir, fn] = directionTable[direction];

    return [dir, fn(parseInt(value, 10))];
  };

  const calculate = pipe([
    getInstructions,
    map(calculateDirection),
    reduce((acc, [direction, amount]) => {
      acc[direction] += amount;

      return acc;
    }, { h: 0, d: 0 }),
    ({ h, d }) => h * d,
  ]);


  console.log(`Part 1: Total is "${calculate(filename)}"`);
};

const part2 = () => {
  const calculate = pipe([
    getInstructions,
    reduce(({ h, d, aim }, [direction, amount]) => {
      switch (direction) {
        case 'up': return { h, d, aim: aim - amount };
        case 'down': return { h, d, aim: aim + amount };
        case 'forward': return { h: h + amount, d: d + (aim * amount), aim };
        default: throw new Error('Something went horribly wrong');
      }
    }, { h: 0, d: 0, aim: 0 }),
    ({ h, d }) => h * d,
  ]);
  console.log(`Part 2: Total is "${calculate(filename)}"`);
};


part1();
part2();
